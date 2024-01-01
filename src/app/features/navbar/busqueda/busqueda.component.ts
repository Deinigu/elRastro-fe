import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import * as L from 'leaflet';



@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css',
  providers: [ProductService, PujaService, DatePipe, UsuarioService],
})
export class BusquedaComponent {
  productos: any[] = [];
  pujas: any[] = [];
  tags ="";
  coordenadas:{ latitude: number, longitude: number }[] = [];
  poscord: any;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private pujaService: PujaService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router : Router,
    private usuarioService: UsuarioService
  ) { }

  redirectToProduct(productId: any) {
    this.router.navigate(['/producto', productId]);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tags = params['tags'];
    });
  
    this.productService.getSearchProducts(this.tags).subscribe((data) => {
      this.productos = data; 
  
      const locationObservables = this.productos.map((product, index) => {
        return this.productService.getProductInfo(product._id).pipe(
          switchMap(data1 => {
            let idUsuario = data1.vendedor;
            return this.usuarioService.getLocation(idUsuario);
          })
        );
      });
  
      forkJoin(locationObservables).subscribe(locations => {
        this.coordenadas = locations.map(location => ({
          latitude: parseFloat(location.latitud),
          longitude: parseFloat(location.longitud)
        }));
        this.initMap(this.coordenadas);
      });
  
      this.productos.forEach((product, index) => {
        let fecha = new Date(product.cierre);
        let now = new Date();
  
        // Calcula el tiempo restante en milisegundos
        let tiempoRestante = fecha.getTime() - now.getTime();
  
        // Agrega el tiempo restante al producto
        this.productos[index].tiempoRestante = tiempoRestante;
  
        // Formatea la fecha para mostrarla en el formato deseado
        let fechaFormateada = this.datePipe.transform(fecha, 'yyyy-MM-dd HH:mm:ss');
        this.productos[index].cierre = fechaFormateada;
  
        this.pujaService.getUltimaPuja(product._id).subscribe((puja) => {
          if (puja) {
            this.productos[index].valor = puja.valor;
          }
        });
      });
    });
  
    setInterval(() => {
      this.actualizarTiempoRestante();
    }, 1000);
  }

  private actualizarTiempoRestante() {
    this.productos.forEach((product, index) => {
      if (product.tiempoRestante > 0) {
        this.productos[index].tiempoRestante -= 1000; // Resta un segundo en milisegundos
      }
    });
  }

  mostrarTiempoRestante(tiempoRestante: number): string {
    if (tiempoRestante <= 0) {
        return 'Subasta cerrada';
    }

    const segundos = Math.floor(tiempoRestante / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    const meses = Math.floor(dias / 30);

    let tiempoFormateado = '';

    if (meses > 0) {
        tiempoFormateado += `${meses}m `;
    }
    if (dias % 30 > 0) {
        tiempoFormateado += `${dias % 30}d `;
    }

    tiempoFormateado += `${horas % 24}h `;
    tiempoFormateado += `${minutos % 60}m `;
    tiempoFormateado += `${segundos % 60}s`;

    return tiempoFormateado;
  }

  private initMap(coordenadas: { latitude: number; longitude: number }[]): void {
    const map = L.map('map').setView([46.603354, -1.888334], 4);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  
    console.log("coordenadas", coordenadas);
    for (let i = 0; i < coordenadas.length; i++) {
      console.log("location", coordenadas[i]);
      if (coordenadas[i]?.latitude && coordenadas[i]?.longitude) {
        const marker = L.marker([coordenadas[i].latitude, coordenadas[i].longitude]).addTo(map);
        marker.bindPopup(`<b>Producto: ${this.productos[i]?.Nombre}</b><br><button class="marker-link" data-id="${this.productos[i]?._id}">Más info</button>`);
        console.log("producto", this.productos[i]?._id);
      }
    }
  
    // Listen for click events on links in the map
    map.on('popupopen', (e) => {
      const popup = e.popup;
      const link = popup.getElement()?.querySelector('.marker-link');
      if (link) {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const id = (event.target as Element).getAttribute('data-id');
          if (id) {
            this.redirectToProduct(id);
          }
        });
      }
    });
  }
}
