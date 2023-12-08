import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';
import { Puja } from '../../../interfaces/puja';

@Component({
  selector: 'app-puja-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './puja-form.component.html',
  styleUrl: './puja-form.component.css',
  providers: [PujaService]
})
export class PujaFormComponent implements OnInit {
  idProducto : any;
  precio: any;
  successMessage = "Puja creada con éxito."
  errorMessage = "Error. El importe debe superar el de la última puja."
  success = false;
  error = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private pujaService : PujaService){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if (puja) {
          this.precio = Number(puja.valor) + 1;
        }else{
          this.precio = data.precio;
        }
      });
    })
  }

  placeBid(precio: {precio: string}){

    if (precio.precio <= this.precio){
      this.showErrorMessage();
    }else{
      const puja: Puja = {
        pujador: '654c0b6302d9a04cac884dbc',
        valor: Number(precio.precio),
        fecha: new Date().toISOString(),
        producto: this.idProducto,
      };
  
      this.pujaService.createPuja(puja).subscribe(
        (res) => {
          console.log(res);
  
          this.showSuccessAlert();
        })
    }
  }

  private showSuccessAlert() {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }

  private showErrorMessage(){
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }

}
