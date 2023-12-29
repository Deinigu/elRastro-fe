import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ConversacionService } from '../../../services/conversacion-service/conversacion.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { MaterialModule } from '../../../material.module'; 
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';

interface Conversation {
  _id: string;
  chats: Mensaje[];
  productoId: string;
  productoNombre?: string;
  comprador?: Usuario;
  vendedor?: Usuario;
  usuario1: string;
  usuario2: string;
  fotoURL: string;
  ultimoMensaje: any;
}

interface Usuario {
  id: string;
  nombreUsuario: string;
}

interface Mensaje {
  userId: string;
  texto: string;
  fecha: string;
}

@Component({
  selector: 'app-mischats',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './mischats.component.html',
  styleUrls: ['./mischats.component.css'],
  providers: [UsuarioService, ConversacionService, ProductService]
})

export class MischatsComponent implements OnInit {
  imagen = ["https://i.blogs.es/a13394/totoro/1366_2000.jpg"]
  usuarioId :any;
  conversaciones: Conversation[] = []; 
  conversacion: any;
  idChat = '';
  mensajeNuevo: string = '';
  conversacionesNuevas: string[] = [];
  listaConversaciones: string[] = [];
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productoService: ProductService,
    private conversacionService: ConversacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {

    this.usuarioId = localStorage.getItem('iduser');

    this.conversacionService.getAllConversaciones(this.usuarioId).subscribe(data => {
      this.conversaciones = data;
      this.usuarioService.getUsuarioInfo(this.usuarioId).subscribe(usuario => {
        this.listaConversaciones = usuario.listaConver;

        this.conversaciones = this.conversaciones.filter(item => this.listaConversaciones.includes(item._id));
        console.log(this.listaConversaciones);
        console.log(this.conversaciones);
        this.conversaciones.forEach(conversacion => {
          // Obtener información del producto
          const productId = conversacion.productoId;
          conversacion.ultimoMensaje = conversacion.chats.at(conversacion.chats.length-1)?.texto;
          if (productId) {
            this.productoService.getProductInfo(productId).subscribe(productDetails => {
              conversacion.fotoURL = productDetails.fotoURL[0];
              conversacion.productoNombre = productDetails.Nombre;
              conversacion.vendedor = { id: productDetails.vendedor, nombreUsuario: '' };
              // Determinar quién es el vendedor y quién es el comprador
              if (this.usuarioId === conversacion.usuario1 && this.usuarioId === productDetails.vendedor) {
                  conversacion.comprador = { id: conversacion.usuario2, nombreUsuario: '' };
                }  else if (this.usuarioId !== conversacion.usuario1 && this.usuarioId !== productDetails.vendedor) {
                conversacion.comprador = { id: conversacion.usuario1, nombreUsuario: '' };
              } else if (this.usuarioId !== conversacion.usuario1 && this.usuarioId === productDetails.vendedor) {
                conversacion.comprador = { id: conversacion.usuario1, nombreUsuario: '' };
              } else {
                conversacion.comprador = { id: conversacion.usuario2, nombreUsuario: '' };
              }

              if (conversacion.vendedor) {
                this.usuarioService.getUsuarioInfo(conversacion.vendedor.id).subscribe(vendedorDetails => {
                  if (conversacion.vendedor) {
                    conversacion.vendedor.nombreUsuario = vendedorDetails.nombreUsuario;
                  }
                });
              }
              
              if (conversacion.comprador) {
                this.usuarioService.getUsuarioInfo(conversacion.comprador.id).subscribe(compradorDetails => {
                  if (conversacion.comprador) {
                    conversacion.comprador.nombreUsuario = compradorDetails.nombreUsuario;
                  }
                }); 
              }               
            });
          }
        }); 
      });     
    });
  }

  accederChat(conversacionId: string) {
    // Lógica para acceder al chat
    window.location.href = `http://localhost:4200/chats/${conversacionId}`;
  }

  borrarChat(conversacionId: string) {
    // Lógica para borrar el chat
    console.log('Borrar el chat con ID:', conversacionId);
    this.usuarioService.getUsuarioInfo(this.usuarioId).subscribe(usuario => {
      this.conversacionesNuevas = usuario.listaConver;
      this.conversacionesNuevas.splice(this.conversacionesNuevas.indexOf(conversacionId), 1);
      usuario.listaConver = this.conversacionesNuevas;
      console.log(usuario);
      this.usuarioService.editarPerfil(this.usuarioId, usuario).subscribe(
        (respuesta) => {
          console.log('Perfil actualizado con éxito:', respuesta);
          window.location.href = `http://localhost:4200/usuario/${this.usuarioId}/chats`;
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
        });;
    });
  }
}
