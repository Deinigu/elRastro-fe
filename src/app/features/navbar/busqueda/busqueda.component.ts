import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css',
  providers: [ProductService, PujaService],
})
export class BusquedaComponent {
  productos: any[] = [];
  pujas: any[] = [];
  tags ="";

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private pujaService: PujaService,
    private route: ActivatedRoute
  ) { }

  redirectToProduct(productId: any) {
    window.location.href = `http://localhost:4200/producto/${productId}`;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tags = params['tags'];
    });

    this.productService.getSearchProducts(this.tags).subscribe((data) => {
      this.productos = data; // Assuming this.productos is where you store the received products

      this.productos.forEach((product, index) => {
        this.pujaService.getUltimaPuja(product._id).subscribe((puja) => {
          if (puja) {
            this.productos[index].valor = puja.valor;
          }
        });
      });
    });
  }
}
