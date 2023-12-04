import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service.service';
import { PujaService } from '../../../services/puja-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.productos = data;

      // Loop through each product to fetch related data
      this.productos.forEach((product) => {
        this.pujaService.getUltimaPuja(product._id).subscribe((pujaData) => {
          this.productos.push(pujaData);
        });
      });
    });
  }
}
