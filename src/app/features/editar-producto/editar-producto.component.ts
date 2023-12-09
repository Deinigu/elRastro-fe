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
onSubmit() {
}
  idProducto = "";
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
    vendedor: '654c0a5b02d9a04cac884db7'
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
      this.producto.cierre = data.tags,
      this.producto.vendedor = data.vendedor
    })
  }
  onButtonVolverClick() : void {
    this.router.navigate(['/']);
  }
}
