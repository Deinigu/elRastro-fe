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
  images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkn_De2_tRJfT_qOpxc68YHTRccXcQd9vZBw&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkn_De2_tRJfT_qOpxc68YHTRccXcQd9vZBw&usqp=CAU"
          ]
  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
    })
  }
}
