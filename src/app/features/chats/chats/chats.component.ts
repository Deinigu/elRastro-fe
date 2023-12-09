import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ConversacionService } from '../../../services/conversacion-service/conversacion.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { MaterialModule } from '../../../material.module'; 
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: string;
  nombreUsuario: string;
}

interface Mensaje {
  userId: string;
  texto: string;
  fecha: Date;
}

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule, FormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
  providers: [UsuarioService, ConversacionService, ProductService]
})

export class ChatsComponent implements OnInit {
  imagen = ["https://i.blogs.es/a13394/totoro/1366_2000.jpg"]

  userId = '654c0a5b02d9a04cac884db7';
  conversacion: any; // Asegúrate de que este tipo coincida con la respuesta de tu servicio
  idChat = '';
  vendedor = '';
  mensajeNuevo: string = '';
  productoNombre = '';

  usuario1: Usuario = { id: '', nombreUsuario: '' };
  usuario2: Usuario = { id: '', nombreUsuario: '' };
  
  constructor(
    private conversacionService: ConversacionService,
    private productoService: ProductService,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idChat = params['idChat'];
    });

    this.conversacionService.getConversacionInfo(this.idChat).subscribe(data => {
      this.conversacion = data;

      // Obtener información del usuario1
      this.usuarioService.getUsuarioInfo(this.conversacion?.usuario1).subscribe(user1Details => {
        this.usuario1 = { id: this.conversacion?.usuario1, nombreUsuario: user1Details.nombreUsuario };
      });

      // Obtener información del usuario2
      this.usuarioService.getUsuarioInfo(this.conversacion?.usuario2).subscribe(user2Details => {
        this.usuario2 = { id: this.conversacion?.usuario2, nombreUsuario: user2Details.nombreUsuario };
      });

      const productId = this.conversacion?.productoId;

      if (productId){
        this.productoService.getProductInfo(productId).subscribe(productDetails => {
          this.vendedor = productDetails.vendedor;
          this.productoNombre = productDetails.Nombre;
        });
      }
    });
  }

  enviarMensaje() {
    if (this.mensajeNuevo.trim() !== '') {
      const nuevoMensaje = {
        userId: this.userId,
        texto: this.mensajeNuevo,
        fecha: new Date().toISOString(),
      };
  
      this.conversacion?.chats.push(nuevoMensaje);
  
      this.conversacionService.enviarMensaje(this.idChat, nuevoMensaje).subscribe((res) => {
        console.log(res);
      });
      this.mensajeNuevo = '';
    }
  }
}
