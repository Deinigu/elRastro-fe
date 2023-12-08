import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { ProductImageComponent } from '../../product-info/product-image/product-image.component';
import { Puja } from '../../../interfaces/puja';
import { FormsModule } from '@angular/forms';
import { PujaFormComponent } from '../puja-form/puja-form.component';

@Component({
  selector: 'app-puja',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PujaFormComponent],
  templateUrl: './puja.component.html',
  styleUrl: './puja.component.css',
  providers: [ProductService, PujaService, ProductImageComponent]
})
export class PujaComponent implements OnInit {
  idProducto : any;
  image: any[] = [];
  nombre : any;
  descripcion : any;
  precio : any;
  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private pujaService : PujaService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.image = data.fotoURL[0];
      this.nombre = data.Nombre;
      this.descripcion = data.descripcion;
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if (puja) {
          this.precio = puja.valor;
        }else{
          this.precio = data.precio;
        }
      });
    })
  }
}
