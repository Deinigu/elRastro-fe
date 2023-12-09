import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, HttpClientModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
  providers: [ProductService],

})
export class CrearProductoComponent implements OnInit{
  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
