import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PujaService } from '../../../services/puja-service/puja-service.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { FormsModule } from '@angular/forms';
import { Puja } from '../../../interfaces/puja';
import { HuellaCarbonoService } from '../../../services/huellaCarbono-service/huella-carbono-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-puja-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './puja-form.component.html',
  styleUrl: './puja-form.component.css',
  providers: [PujaService, ProductService, HuellaCarbonoService]
})
export class PujaFormComponent implements OnInit {
  idProducto : any;
  precio: any;
  precioPujar: any;
  successMessage = "Puja creada con éxito."
  errorMessage = "Error. El importe debe superar el de la última puja."
  success = false;
  error = false;
  producto: any;
  tasa: any;
  idUsuario1 = "654c0a5b02d9a04cac884db7"


  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, 
    private pujaService : PujaService, private huellaCarbonoService : HuellaCarbonoService, private router : Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.producto = data;
      this.precio = this.producto.precio;
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if(puja){
          this.producto.valor = puja.valor;
          this.precio = puja.valor;
        }
      this.huellaCarbonoService.getHuellaCarbono(this.idUsuario1, this.producto.vendedor).subscribe(response =>{
      this.tasa = response.tasa_emisiones;
    });
      });
    });
  }

  placeBid(precio: {precio: string}){
    this.precioPujar = Number(precio.precio);
    if (this.precioPujar <= this.precio){
      this.showErrorMessage();
    }else{
      const puja: Puja = {
        pujador: '654c0a5b02d9a04cac884db7',
        valor: this.precioPujar,
        fecha: new Date().toISOString(),
        producto: this.idProducto,
      };
      this.pujaService.createPuja(puja).subscribe(
        (res) => {
          console.log(res);
          this.showSuccessAlert();
          this.redirectionProduct();
        })
    }
  }

  private showSuccessAlert() {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }

  public showErrorMessage(){
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }

  public redirectionProduct(){
    this.router.navigate(['/producto', this.idProducto]);
  }

}
