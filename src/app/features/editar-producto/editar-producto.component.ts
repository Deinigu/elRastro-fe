import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product.service';
import { ImageService } from '../../services/image-service/image-service.service';
import { Producto } from '../../interfaces/productos.ts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css',
  providers: [ProductService, ImageService]
})
export class EditarProductoComponent implements OnInit {

  idProducto = "";
  tagsInput: string = "";
  error_empty_field: boolean = false;
  error_precio: boolean = false;
  error_fotos: boolean = false;
  error_fecha: boolean = false;
  producto_creado: boolean = false;
  producto_en_proceso: boolean = false;
  error_general: boolean = false;
  datestring : string = '';

  producto: Producto = {
    Nombre: '',
    descripcion: '',
    fotoURL: [],
    precio: 0,
    tags: [],
    cierre: new Date(),
    vendedor: ''
  };

  constructor(private http: HttpClient,
    private productService: ProductService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
        this.producto.Nombre = data.Nombre,
        this.producto.descripcion = data.descripcion,
        this.producto.fotoURL = data.fotoURL,
        this.producto.precio = data.precio,
        this.producto.tags = data.tags,
        this.producto.cierre = data.cierre,
        this.producto.vendedor = data.vendedor

        this.datestring = new Date(data.cierre).toISOString().slice(0, 16);;

        this.tagsInput = this.producto.tags.join(',');
      });
  }

  onSubmit() {
    this.producto.tags = this.tagsInput.split(',').map(tag => tag.trim());
    this.producto.cierre = new Date(this.datestring);
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

    else {
      console.log(this.producto);
      this.producto_en_proceso = true;
      this.productService.editProducto(this.idProducto, this.producto)
        .subscribe(
          (respuesta) => {
            console.log('Product edited:', respuesta);
            this.producto_en_proceso = false;
            this.producto_creado = true;
          },
          (error) => {
            console.error('Error creating product:', error);
            this.producto_en_proceso = false;
            this.error_general = true;
          });
    }
  }

  onButtonVolverClick(): void {
    this.router.navigate(['/']);
  }
}
