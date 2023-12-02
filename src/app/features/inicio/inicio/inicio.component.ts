import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductService } from '../../../services/product-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MaterialModule, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  providers: [ProductService]
})
export class InicioComponent implements OnInit {

  productos: any[] = [];

  constructor(private http: HttpClient, private productService: ProductService) { }


  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.productos = data;
      console.log(this.productos);
    })
  }
}
