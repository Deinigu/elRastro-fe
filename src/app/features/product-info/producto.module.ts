// product.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map/map.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { PriceComponent } from './price/price.component';

const modules: any[] = [
    MapComponent,
    ProductDetailsComponent,
    ProductImageComponent,
    PriceComponent
]

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules],
})
export class ProductModule {}
