import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { ProductModule } from '../producto.module';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule, MaterialModule, ProductModule],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {

}
