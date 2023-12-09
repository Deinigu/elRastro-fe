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
  usuarioId = '';
  conversaciones: Conversation[] = []; 
  conversacion: any;
  idChat = '';
  mensajeNuevo: string = '';
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productoService: ProductService,
    private conversacionService: ConversacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.usuarioId = params['id'];
    });

    this.conversacionService.getAllConversaciones(this.usuarioId).subscribe(data => {
      this.conversaciones = data;
      this.conversaciones.forEach(conversacion => {
        // Obtener información del producto
        const productId = conversacion.productoId;
        if (productId) {
          this.productoService.getProductInfo(productId).subscribe(productDetails => {
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
  }

  accederChat(conversacionId: string) {
    // Lógica para acceder al chat
    console.log('Acceder al chat con ID:', conversacionId);
  }

  borrarChat(conversacionId: string) {
    // Lógica para borrar el chat
    console.log('Borrar el chat con ID:', conversacionId);
  }
}
