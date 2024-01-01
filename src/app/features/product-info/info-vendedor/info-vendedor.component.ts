import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Conversacion } from '../../../interfaces/conversacion';
import { ConversacionService } from '../../../services/conversacion-service/conversacion.service';

@Component({
  selector: 'app-info-vendedor',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info-vendedor.component.html',
  styleUrl: './info-vendedor.component.css',
  providers: [UsuarioService, ProductService, ConversacionService]
})
export class InfoVendedorComponent implements OnInit{
  vendedor: string = "";
  idVendedor: string="";
  idProducto : string = "";
  idUsuario : any;
  listaConversacionesUsuario: string[] = [];
  listaConversacionesVendedor: string[] = [];
  idConversacion: string = "";
  redirigiendo = false;
  deshabilitar = false;
  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productService: ProductService,
    private usuarioService: UsuarioService,
    private conversacionService: ConversacionService,
    private router: Router){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });
    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.idVendedor = data.vendedor;
      this.idVendedor == this.idUsuario || this.idUsuario==null ? this.deshabilitar=true : this.deshabilitar=false;
      this.usuarioService.getUsuarioInfo(this.idVendedor).subscribe(data2 => {
        this.vendedor = data2.nombreUsuario;
      })
    })
    this.idUsuario = localStorage.getItem('iduser');
  }

  crearConversacion(idUsuario: string, idVendedor: string, idProducto: string){
    //CREAR LA CONVERSACION
    const conversacion: Conversacion ={
      usuario1: idUsuario,
      usuario2: idVendedor,
      productoId: idProducto,
      chats: []
    };
    this.conversacionService.getConversacionDe(idUsuario, idVendedor,idProducto).subscribe(c => {
      this.router.navigate(['/chats', c]);
      },
      (error) => {
        this.redirigiendo = true;
        this.conversacionService.createConversacion(conversacion).subscribe(
          (res) => {
            console.log(res);
            //ASIGNARLE LA CONVERSACION A USUARIO Y VENDEDOR
            this.usuarioService.getUsuarioInfo(idUsuario).subscribe(usuario => {
              this.listaConversacionesUsuario = usuario.listaConver;
              this.usuarioService.getUsuarioInfo(idVendedor).subscribe(vendedor => {
                this.conversacionService.getConversacionDe(idUsuario, idVendedor,idProducto).subscribe(c => {
                  this.listaConversacionesVendedor = vendedor.listaConver;
                  this.idConversacion = c;

                  console.log(this.idConversacion);
                  
                  this.listaConversacionesVendedor.push(this.idConversacion);
                  this.listaConversacionesUsuario.push(this.idConversacion);
    
                  usuario.listaConver = usuario.listaConver;
                  vendedor.listaConver = vendedor.listaConver;

                  console.log(usuario.listaConver);
    
                  this.usuarioService.editarPerfil(idUsuario, usuario).subscribe(
                    (res) =>{
                      console.log(res);
                      this.usuarioService.editarPerfil(idVendedor, vendedor).subscribe(
                        (res) => {
                          console.log(res);
                          this.router.navigate(['/chats', this.idConversacion]);
                        }
                      );
                    }
                  );
                })
                
              })
           })
        })
      });
  }

}
