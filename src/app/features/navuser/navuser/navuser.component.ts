import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { ValoracionesService } from '../../../services/valoraciones-service/valoraciones.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { StarsComponent } from '../../perfil-usuario/stars/stars.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ValoracionComponent } from '../../valoracion/valoracion.component';
import { PaypalComponent } from '../../paypal/paypal.component';
interface Valoracion {
  idUsuario: string;
  idValorado: string;
  puntuacion: number;
  comentario: string;
  fecha: Date;
  idProducto: string;
  producto: Producto | null; 
  nombreUsuario: string | null;

}

interface Producto {
  id: string;
  nombreProducto: string;
  precioPuja: number;
  descripcion: string;
  fotoProducto: string;
  vendedor: string;
  cierre: string;
}

interface Puja {
  _id: string;
  pujador: string;
  valor: number;
  producto: Producto;
  fecha: string;
  pagado: boolean;
  nombreVendedor: string | null;
  nombreComprador: string | null;
  nommbrepujador: string | null;
}

@Component({
  selector: 'app-navuser',
  standalone: true,
  imports: [CommonModule, NgbNavModule, StarsComponent, HttpClientModule, ValoracionComponent, PaypalComponent],
  templateUrl: './navuser.component.html',
  styleUrls: ['./navuser.component.css'],
  providers: [UsuarioService, ProductService, ValoracionesService, PujaService],
})

export class NavuserComponent implements OnInit {

  mensajeValoracion: string | null = null;
  abrir = localStorage.getItem('abrir')
  active = this.abrir!==null? parseInt(this.abrir) : 1 ;

  imagen = '';
  title = 'Perfil de usuario';
  nombreUsuario = '';
  idUsuario = '';
  valoracion = 0;
  vivienda = '';
  telefono = '';
  valoraciones: Valoracion[] = [];
  productosVenta: Producto[] = [];
  correo = '';
  usuario = '';

  pujas: Puja[] = [];
  productosGanados: Map<string, number> = new Map<string, number>();
  valoracionesPendientes: Puja[] = [];
  valoracionesPendientesVendedor: Puja[] = [];
  valoracionesRecibidas: Valoracion[] = [];
  valoracionesHechas: Valoracion[] = [];

  misProductos: Producto[] | undefined;
  pujadorInfo = '';

  productoBorrar : Producto ={
    id: '',
    nombreProducto: '',
    precioPuja: 0,
    descripcion: '',
    fotoProducto: '',
    vendedor: '',
    cierre: '',
  };
  miPerfil = false;
  usuarioLogeado = '654c0a5b02d9a04cac884db7';
  


  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private productService: ProductService,
    private valoracionesService: ValoracionesService,
    private pujasService: PujaService,
    private router: Router
  ) {}

  manejarValoracionCompletada(mensaje: string) {
    this.mensajeValoracion = mensaje;
    // alert(this.mensajeValoracion);  
    //this.router.navigate(['usuario/'+ this.idUsuario]);  
  }

  ngOnInit() {
    
    this.route.params.subscribe((params) => {
      this.idUsuario = params['id'];
    });
   
        // OBTENGO PUJAS
        this.pujasService.getPujasByUser(this.idUsuario).subscribe((dataPujas: any) => {
          this.pujas = dataPujas;
          this.pujas.forEach((puja: any, index: number) => {
            this.productService.getProductInfo(puja.producto).subscribe((dataProducto: any) => {
              const producto: Producto = {
                id: dataProducto._id,
                nombreProducto: dataProducto.Nombre,
                precioPuja: dataProducto.precio,
                descripcion: dataProducto.descripcion,
                fotoProducto: dataProducto.fotoURL[0],
                vendedor: dataProducto.vendedor,
                cierre: dataProducto.cierre,
              };
        
              this.usuarioService.getUsuarioInfo(producto.vendedor).subscribe((dataUsuario: any) => {
                this.pujas[index].nombreVendedor = dataUsuario.nombreUsuario;
        
                this.pujas[index].producto = producto;
                console.log("NOMBRE PRODUCTO: ", puja.producto.nombreProducto);
        
                this.pujasService.getUltimaPuja(this.pujas[index].producto.id).subscribe((pujaInfo: any) => {
                  const fechaCierreUtc = new Date(producto.cierre).getTime();
                  const ahoraUtc = new Date().getTime();
        
                  if (fechaCierreUtc < ahoraUtc && pujaInfo.valor == puja.valor) {
                    const existeValoracion = this.existeValoracionAnteriorComprador(puja.producto.id, this.idUsuario);
                    if (!existeValoracion) {
                      this.valoracionesPendientes.push(this.pujas[index]);
                    } else {
                      // Eliminar la puja del array si ya existe una valoración anterior
                      this.valoracionesPendientes = this.valoracionesPendientes.filter((valoracion: any) => valoracion.id !== this.pujas[index]._id);
                    
                    }
                  }
                });
              });
            });
          });
        });

        // OBTENGO PRODUCTOS
        this.productService.getAllProducts().subscribe((data: any) => {
          this.productosVenta = data;
          this.misProductos = this.productosVenta.filter((producto: any) => producto.vendedor === this.idUsuario && producto.cierre < new Date().toISOString());
        
          if (this.misProductos.length > 0) {
            this.misProductos.forEach((producto: any) => {
              this.pujasService.getUltimaPuja(producto._id).subscribe((pujaInfo: any) => {
                this.productService.getProductInfo(pujaInfo.producto).subscribe((dataProducto: any) => {
                  const productoDetallado: Producto = {
                    id: dataProducto._id,
                    nombreProducto: dataProducto.Nombre,
                    precioPuja: dataProducto.precio,
                    descripcion: dataProducto.descripcion,
                    fotoProducto: dataProducto.fotoURL[0],
                    vendedor: dataProducto.vendedor,
                    cierre: dataProducto.cierre,
                  };
                  
                  this.usuarioService.getUsuarioInfo(pujaInfo.pujador).subscribe((dataUsuario: any) => {
                  pujaInfo.nombreComprador = dataUsuario.nombreUsuario;
                  pujaInfo.nommbrepujador = dataUsuario.nombreUsuario;
                  pujaInfo.producto = productoDetallado;
                  this.pujadorInfo = pujaInfo.pujador;
        
                  const existeValoracion = this.existeValoracionAnteriorVendedor(pujaInfo.producto.id, pujaInfo.pujador);
        
                  if (!existeValoracion) {
                    this.valoracionesPendientesVendedor.push(pujaInfo);
                  } else {
                    // Eliminar la puja del array si ya existe una valoración anterior
                    this.valoracionesPendientesVendedor = this.valoracionesPendientesVendedor.filter((valoracion: any) => valoracion.id !== pujaInfo._id);
                  }
                });
                });
              });
            });
          }
        });
        

    this.miPerfil = this.idUsuario == this.usuarioLogeado;

    this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe((data) => {
      this.usuario = data.nombreUsuario;
      this.valoracion = data.reputacion;
      this.vivienda = data.vivienda;
      this.telefono = data.telefono;
      this.imagen = data.fotoURL;
      this.correo = data.correo;

      this.valoracionesService.getValoraciones(this.idUsuario).subscribe((dataComentario: Valoracion[]) => {
        this.valoraciones = dataComentario.map(comentario => ({
          idUsuario: comentario.idUsuario,
          idValorado: comentario.idValorado,
          puntuacion: comentario.puntuacion,
          comentario: comentario.comentario,
          fecha: comentario.fecha,
          idProducto: comentario.idProducto,
          producto: null,
          nombreUsuario: null, 
        }));

        // Recorrer las valoraciones y obtener el nombre de usuario para cada una
        this.valoraciones.forEach((valoracion, index) => {
          this.usuarioService.getUsuarioInfo(valoracion.idUsuario).subscribe((dataUsuario: any) => {
            this.valoraciones[index].nombreUsuario = dataUsuario.nombreUsuario;
          });
        });

        // Recorrer las valoraciones y obtener información del producto para cada una
        this.valoraciones.forEach((valoracion, index) => {
          this.productService.getProductInfo(valoracion.idProducto).subscribe((dataProducto: any) => {
            const producto: Producto = {
              id: dataProducto._id,
              nombreProducto: dataProducto.Nombre,
              precioPuja: dataProducto.precio,
              descripcion: dataProducto.descripcion,
              fotoProducto: dataProducto.fotoURL[0],
              vendedor: dataProducto.vendedor,
              cierre: dataProducto.cierre,
            };
            this.valoraciones[index].producto = producto;
          });
        });
        
        this.fetchProductosVenta(data.productosVenta);
      });

      this.pujasService.getPujasByUser(this.idUsuario).subscribe((dataPujas: any) => {
        this.pujas = dataPujas;

        // Obtener información del producto para cada puja
        this.pujas.forEach((puja: any, index: number) => {
          this.productService.getProductInfo(puja.producto).subscribe((dataProducto: any) => {
            const producto: Producto = {
              id: dataProducto._id,
              nombreProducto: dataProducto.Nombre,
              precioPuja: dataProducto.precio,
              descripcion: dataProducto.descripcion,
              fotoProducto: dataProducto.fotoURL[0],
              vendedor: dataProducto.vendedor,
              cierre: dataProducto.cierre,
            };

            this.usuarioService.getUsuarioInfo(producto.vendedor).subscribe((dataUsuario: any) => {
              this.pujas[index].nombreVendedor = dataUsuario.nombreUsuario;
            });
            // Asignar la información del producto a la puja
            this.pujas[index].producto = producto;       
          });
        });
      });
    });

  
  }

  fetchProductosVenta(productosVenta: string[]) {
    this.productosVenta = []; 
    productosVenta.forEach((currentProductId) => {
      this.productService.getProductInfo(currentProductId).subscribe((dataProducto: any) => {
        const producto: Producto = {
          id: dataProducto._id,
          nombreProducto: dataProducto.Nombre,
          precioPuja: dataProducto.precio,
          descripcion: dataProducto.descripcion,
          fotoProducto: dataProducto.fotoURL[0],
          vendedor: dataProducto.vendedor,
          cierre: dataProducto.cierre,
        };
  
        this.productosVenta.push(producto);
      });
    });
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil', this.idUsuario]);
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  esPujaMasAltaYUsuario(puja: any): boolean {
    if (this.haPasadoFecha(puja.producto.cierre)) {
      if (!puja.procesado) {
        puja.procesado = true;
        this.pujasService.getUltimaPuja(puja.producto.id).subscribe((data: any) => {
          if (data) {
            puja.esLaMasAlta = puja.valor === data.valor;
          } else {
            puja.esLaMasAlta = true;
          }
     
          // Actualizamos la propiedad ganador en la puja específica
          puja.ganador = puja.esLaMasAlta && puja.pujador === this.idUsuario;
        });
      }
      // Retornamos la propiedad ganador específica de esta puja
      return puja.ganador;
    }
  
    return false;
  }

  
  haPasadoFecha(fechaCierre: string): boolean {
    const fechaCierreUtc = new Date(fechaCierre).getTime();
    const ahoraUtc = new Date().getTime();
    return fechaCierreUtc < ahoraUtc;
  }

      // Función para verificar si existe una valoración anterior del usuario para este producto y vendedor
      existeValoracionAnteriorComprador(productId: string, usuarioId: string): boolean {
        return this.valoracionesHechas.some(valoracion => valoracion.idProducto === productId && valoracion.idUsuario === usuarioId);
      }

      existeValoracionAnteriorVendedor(productId: string, usuarioId: string): boolean {
        return this.valoracionesHechas.some(valoracion => valoracion.idProducto === productId && valoracion.idValorado === usuarioId);
      }
      
    

  

  guardaProd(prod: Producto){
    this.productoBorrar=prod;
  }

  deleteProd(prod: Producto){
    this.productService.deleteProducto(prod.id).subscribe();
  }

  volver(){
    location.reload();
  }

  editarProducto(prod: Producto)
  {
    this.router.navigate(['/producto/editar',prod.id]);
  }

  
  onClickToFotoDePerfil() {
    this.router.navigate(['/usuario/cambiarimagen',this.idUsuario]);
  }

}
