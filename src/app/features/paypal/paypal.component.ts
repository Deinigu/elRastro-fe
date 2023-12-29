import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { PujaService } from '../../services/puja-service/puja-service.service';
import { Puja } from '../../interfaces/puja';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css',
  providers: [ProductService, PujaService, NgbActiveModal]
})
export class PaypalComponent implements OnInit{

  public payPalConfig ? : IPayPalConfig;
  showSuccess: boolean | undefined;
  idProducto : any;
  producto : any;
  precio : any;
  successMessage = "Autorizando la transacción..."
  @Input() puja: any;
  @Input() tasa: any;

  constructor(private productService: ProductService, private route: ActivatedRoute, private pujaService : PujaService, private modalService: NgbModal){}

  ngOnInit(): void {

    this.initConfig();

    this.idProducto = this.puja.producto;
   

    this.productService.getProductInfo(this.idProducto).subscribe(data => {
      this.producto = data;
      this.pujaService.getUltimaPuja(this.idProducto).subscribe((puja) => {
        if(puja){
          this.producto.valor = puja.valor;
        }else{
          this.producto.valor = this.producto.precio;
        }
      });
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'ASLmoMV5X6gZNzAHiRhbwJNpsByaPAAUpoAptgvEVREn3KBIeO5BkYYFga3hqsBTBR1kah-Wo3-TnTaH',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          { 
            reference_id: 'producto',
            amount: {
              currency_code: 'EUR',
              value: this.puja.valor,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.puja.valor
                }
              }
            },
            items: [
              {
                name: 'Producto',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: this.puja.valor,
                },
              }
            ],
            payee: {
              email_address: 'payee@example.com' // Payee for Item 2
            }
          },

          {
            reference_id: 'huella',
            amount: {
              currency_code: 'EUR',
              value: this.puja.tasa,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.puja.tasa
                }
              }
            },
            items: [
              {
                name: 'Tasa huella carbono',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: this.puja.tasa,
                },
              }
            ],
            payee: {
              email_address: 'payee@example.com' // Payee for Item 2
            }
          }
          
        ]
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'horizontal'
      },
      onApprove: (data, actions) => {
        this.showSuccess = true;
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = false;
        console.log("PUJAJJAJJAJAJAJAJ", this.puja._id);
        alert('Pago realizado con éxito.');
        
        ///this.puja.pagado = true;
        this.pujaService.putPujaPagada(this.puja._id).subscribe(
          (res) => {
            console.log(res);
          })
        location.reload();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        console.log(this.puja);
      },
    };
  }

  placeBid(){
    const puja: Puja = {
      pujador: '654c0a5b02d9a04cac884db7',
      valor: this.puja.valor,
      fecha: new Date().toISOString(),
      producto: this.idProducto,
      tasa: this.tasa,
      pagado: false
    };
    this.pujaService.createPuja(puja).subscribe(
      (res) => {
        console.log(res);
      })
  }
}