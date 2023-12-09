import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service/product.service';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  providers: [ProductService, PujaService],
})
export class InicioComponent implements OnInit {
  productos: any[] = [];
  pujas: any[] = [];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private pujaService: PujaService
  ) { }

  redirectToProduct(productId: any) {
    window.location.href = `http://localhost:4200/producto/${productId}`;
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
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
