import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';

@Component({
  selector: 'app-price',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price.component.html',
  styleUrl: './price.component.css',
  providers: [ProductService, PujaService]
})
export class PriceComponent implements OnInit {
  producto : any;
  idProducto : any;
  ultimaPuja : any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private pujaService: PujaService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.producto = data;
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if(puja){
          this.producto.valor = puja.valor;
        }
      });
    });
  }
}
