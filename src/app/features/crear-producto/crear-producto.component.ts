import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image-service/image-service.service';
import { Producto } from '../../interfaces/productos.ts';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, HttpClientModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
  providers: [ProductService, ImageService],

})
export class CrearProductoComponent implements OnInit {
  selectedFiles: File[] = [];
  urls: any[] = [];
  fotos_subidas: boolean = false;
  tagsInput: string = "";

  producto: Producto = {
    Nombre: '',
    descripcion: '',
    fotoURL: [],
    precio: 0,
    tags: [],
    cierre: new Date(),
    vendedor: '654c0a5b02d9a04cac884db7'
  };


  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.fotos_subidas = false;
  }

  onSubmit() {
    this.producto.tags = this.tagsInput.split(',').map(tag => tag.trim());
    this.producto.cierre = new Date(this.producto.cierre);
    this.producto.precio = Number(this.producto.precio);
    console.log(this.producto);

    this.productService.createProducto(this.producto).subscribe(
      (createdProduct) => {
        console.log('Product created:', createdProduct);
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );  }

  // Cloudinary
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onButtonClicked(): void {
    if (this.selectedFiles.length > 0) {
      this.imageService.uploadImage(this.selectedFiles).subscribe(response => {
        if (response) {
          this.urls = response.urls;
          this.producto.fotoURL = this.urls;
          this.fotos_subidas = true;
        }
      });
    }
  }
}
