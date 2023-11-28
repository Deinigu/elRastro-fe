import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  providers: [ProductService]
})
export class ProductDetailsComponent implements OnInit {
  nombre = "";
  descripcion = "";
  idProducto = "";

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.nombre = data.Nombre;
      this.descripcion = data.descripcion;
    })
  }
}
