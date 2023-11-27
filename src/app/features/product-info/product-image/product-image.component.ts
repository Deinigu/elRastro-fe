import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.css'
})
export class ProductImageComponent {
  images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkn_De2_tRJfT_qOpxc68YHTRccXcQd9vZBw&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkn_De2_tRJfT_qOpxc68YHTRccXcQd9vZBw&usqp=CAU"
          ]
}
