import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  providers: [ProductService, PujaService, DatePipe],
})
export class InicioComponent implements OnInit {
  
  
  productos: any[] = [];
  pujas: any[] = [];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private pujaService: PujaService,
    private datePipe: DatePipe, 
    private router: Router
  ) { }

  redirectToProduct(productId: any) {
    this.router.navigate(['/producto', productId]);
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.productos = data;

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

        // Obtén la última puja
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
}
