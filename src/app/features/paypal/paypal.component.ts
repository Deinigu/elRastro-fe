import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICreateOrderRequest, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { ProductService } from '../../services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { PujaService } from '../../services/puja-service/puja-service.service';

@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [CommonModule, NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css',
  providers: [ProductService, PujaService]
})
export class PaypalComponent implements OnInit{
  @Output() placeBid: EventEmitter<void> = new EventEmitter<void>();

  public payPalConfig ? : IPayPalConfig;
  showSuccess: boolean | undefined;
  idProducto : any;
  producto : any;
  precio : any;

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
            value: this.producto.valor,
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.producto.valor
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
                value: this.producto.valor,
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
      this.placeBid.emit();
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);

    },
  };
  }
}