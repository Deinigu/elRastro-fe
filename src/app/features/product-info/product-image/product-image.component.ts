import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service/product.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css',
  providers: [ProductService]
})
export class ProductImageComponent implements OnInit{
  idProducto = "";
  images = [""];
  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.images = [data.fotoURL];
    })
  }
}
