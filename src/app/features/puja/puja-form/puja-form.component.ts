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
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaypalComponent } from '../../paypal/paypal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-puja-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, PaypalComponent],
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
  idUsuario1 : any;
  subscription: any;


  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, 
    private pujaService : PujaService, private huellaCarbonoService : HuellaCarbonoService, private router : Router,
    private modalService: NgbModal){}

    ngOnInit(): void {
      this.idUsuario1 = localStorage.getItem('iduser');
      this.route.params.pipe(
        switchMap(params => {
          this.idProducto = params['id'];
          return this.productService.getProductInfo(this.idProducto);
        }),
        switchMap(producto => {
          this.producto = producto;
          this.precio = this.producto.precio;
          return this.pujaService.getUltimaPuja(this.idProducto).pipe(
            catchError(() => of(null))
          );
        }),
        switchMap(puja => {
          if (puja) {
            this.producto.valor = puja.valor;
            this.precio = puja.valor;
          }
          return this.huellaCarbonoService.getHuellaCarbono(this.idUsuario1, this.producto.vendedor);
        })
      ).subscribe(response => {
        //console.log("RESPONSE", response);
        this.tasa = response.tasa_emisiones;
        //console.log("TASA", this.tasa);
      }, error => {
        console.error("Error: ", error);
      });
    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    
  placeBid(){
    if (!(this.precioPujar > this.precio)){
      this.showErrorMessage();
    }else{
      const puja: Puja = {
        pujador: localStorage.getItem('iduser'),
        valor: this.precioPujar,
        fecha: new Date().toISOString(),
        producto: this.idProducto,
        tasa: this.tasa,
        pagado: false
      };
      this.pujaService.createPuja(puja).subscribe(
        (res) => {
          console.log(res);
          this.showSuccessAlert();
          this.redirectionProduct();
        })
    }
  }
  confirmar(){
    if (!(this.precioPujar > this.precio)){
      this.showErrorMessage();
      console.log("error");
    }else{
      this.error=false;
    }
  }

  private showSuccessAlert(): void {
    this.success = true;
    setTimeout(() => {
      this.success = false;
    }, 3000);
  }

  public showErrorMessage(){
    this.error = true;
    /*setTimeout(() => {
      this.error = false;
    }, 3000);*/
  }

  public redirectionProduct(){
    this.router.navigate(['/producto', this.idProducto]);
  }

  public guardarValor(precio: {precio: string}){
    if (precio.precio != undefined && precio.precio != null && Number(precio.precio) > this.precio){
      this.precioPujar = precio.precio;
      this.error = false;
    }
    
  }

}
