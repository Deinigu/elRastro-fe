import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { PujaService } from '../../services/puja-service/puja-service.service';
import { Puja } from '../../interfaces/puja';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css',
  providers: [ProductService, PujaService]
})
export class PaypalComponent implements OnInit{

  public payPalConfig ? : IPayPalConfig;
  showSuccess: boolean | undefined;
  idProducto : any;
  producto : any;
  precio : any;
  @Input() precioPujar: any;
  @Input() tasa: any;

  constructor(private productService: ProductService, private route: ActivatedRoute, private pujaService : PujaService){}

  ngOnInit(): void {

    this.initConfig();

    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

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
              value: this.precioPujar,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.precioPujar
                }
              }
            },
            items: [
              {
                name: this.producto.Nombre,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: this.precioPujar,
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
              value: '0.2',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '0.2'
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
                  value: '0.2',
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
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        this.placeBid();
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        console.log(this.precioPujar);
      },
    };
  }

  placeBid(){
    const puja: Puja = {
      pujador: '654c0a5b02d9a04cac884db7',
      valor: this.precioPujar,
      fecha: new Date().toISOString(),
      producto: this.idProducto,
    };
    this.pujaService.createPuja(puja).subscribe(
      (res) => {
        console.log(res);
      })
  }
}