import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image-service/image-service.service';
import { Producto } from '../../interfaces/productos.ts';
import { Router } from '@angular/router';


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
  error_empty_field: boolean = false;
  error_precio: boolean = false;
  error_fotos: boolean = false;
  error_fecha: boolean = false;
  producto_creado: boolean = false;
  producto_en_proceso: boolean = false;
  error_general: boolean = false;

  producto: Producto = {
    Nombre: '',
    descripcion: '',
    fotoURL: [],
    precio: 0,
    tags: [],
    cierre: new Date(),
    vendedor: ''
  };


  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private imageService: ImageService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.producto.vendedor = localStorage.getItem('iduser');
    this.fotos_subidas = false;
    this.producto_creado = false;
  }

  onSubmit() {
    this.producto.tags = this.tagsInput.split(',').map(tag => tag.trim());
    this.producto.cierre = new Date(this.producto.cierre);
    this.producto.precio = Number(this.producto.precio);

    // Reiniciar errores
    this.error_empty_field = false;
    this.error_precio = false;
    this.error_fotos = false;
    this.error_fecha = false;
    this.error_general = false;

    // Get today's date
    const currentDate = new Date();
    if (this.producto.cierre <= currentDate) {
      this.error_fecha = true;
      return;
    }
    else if (this.producto.Nombre.length == 0 || this.producto.descripcion.length == 0 || this.producto.tags.length == 0) {
      this.error_empty_field = true;
    } else if (this.producto.precio <= 0) {
      this.error_precio = true;
    }
    else if (!this.fotos_subidas) {
      this.error_fotos = true;
    }

    else {
      console.log(this.producto);
      this.producto_en_proceso = true;

      this.productService.createProducto(this.producto).subscribe(
        (createdProduct) => {
          console.log('Product created:', createdProduct);
          this.producto_en_proceso = false;
          this.producto_creado = true;
        },
        (error) => {
          console.error('Error creating product:', error);
          this.producto_en_proceso = false;
          this.error_general = true;
        }
      );
    }
  }

  onButtonVolverClick() : void {
    this.router.navigate(['/']);
  }

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
