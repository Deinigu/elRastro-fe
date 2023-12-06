import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-info-vendedor',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info-vendedor.component.html',
  styleUrl: './info-vendedor.component.css',
  providers: [UsuarioService, ProductService]
})
export class InfoVendedorComponent implements OnInit{
  vendedor = "";
  idUsuario="";
  idProducto = "";

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private usuarioService: UsuarioService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.idUsuario = data.vendedor;
      this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe(data2 => {
        this.vendedor = data2.nombreUsuario;
        console.log(data2);
      })
    })
  }

}
