import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { Router } from '@angular/router';

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
  idVendedor : any;
  idUsuario: string="654c0a5b02d9a04cac884db7";
  ultimaPuja : any;
  cierre : any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService,
     private pujaService: PujaService, private router : Router){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.producto = data;
      this.idVendedor = this.producto.vendedor;
      if (this.idVendedor == this.idUsuario) {
        this.cierre = false;
      }else{
        let fechaCierre = new Date(this.producto.cierre);
        let hoy = new Date();
        this.cierre = fechaCierre < hoy ? false : true;
      }
      
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if(puja){
          this.producto.valor = puja.valor;
        }
      });
    });
  }
  navigateToPuja() {
    if (this.cierre) {
        this.router.navigate(['/puja', this.idProducto]);
    }
}
}
