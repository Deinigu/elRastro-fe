import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ProductService } from '../../../services/product-service/product.service';
import { ValoracionesService } from '../../../services/valoraciones-service/valoraciones.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { StarsComponent } from '../../perfil-usuario/stars/stars.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
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
}

@Component({
  selector: 'app-navuser',
  standalone: true,
  imports: [CommonModule, NgbNavModule, StarsComponent, HttpClientModule],
  templateUrl: './navuser.component.html',
  styleUrls: ['./navuser.component.css'],
  providers: [UsuarioService, ProductService, ValoracionesService],
})

export class NavuserComponent implements OnInit {
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
  productoBorrar : Producto ={
    id: '',
    nombreProducto: '',
    precioPuja: 0,
    descripcion: '',
    fotoProducto: '',
    vendedor: '',
  };
  miPerfil = false;
  usuarioLogeado = '654c0a5b02d9a04cac884db7';
  

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private productService: ProductService,
    private valoracionesService: ValoracionesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idUsuario = params['id'];
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
            };
            this.valoraciones[index].producto = producto;
          });
        });
        
        this.fetchProductosVenta(data.productosVenta);
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
        };
  
        this.productosVenta.push(producto);
      });
    });
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil', this.idUsuario]);
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

}
