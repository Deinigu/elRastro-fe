import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image-service/image-service.service';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, HttpClientModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
  providers: [ProductService, ImageService],

})
export class CrearProductoComponent implements OnInit{
  selectedFiles: File[] = [];

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private imageService: ImageService
  ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onButtonClicked(): void {
    if (this.selectedFiles.length > 0) {
      this.imageService.uploadImage(this.selectedFiles).subscribe(response => {
        console.log('Images uploaded:', response.urls);
        // Handle the response as needed
      });
    }
  }
}
