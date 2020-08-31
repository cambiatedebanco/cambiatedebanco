import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { ApiMercadopagoService } from '../../services/api-mercadopago.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { get } from 'scriptjs';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit {
  hoy : any;
  init_point: any;
  
 
    items={
        
            name: 'Mi producto',
            price: 1000,
            unit: 1
        }
    
  
  constructor( private postgresqlService: PostgresService,private checkoutService: CheckoutService,private apiMercadopagoService: ApiMercadopagoService) { }

  ngOnInit(): void {
  /*  this.postgresqlService.getFlow(this.items).subscribe(res=>{
      
        console.log(res);
      });*/

  /* get("https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js", () => {
      //library has been loaded...
    });*/
  }

  onBuy() {
   /* this.checkoutService.goCheckOut(this.preference).then(result => {
      // Read result of the Cloud Function.
      this.init_point = result.data.result;
      console.log(this.init_point);
      //window.location.href = this.init_point;
    }).catch(error => {
      console.log(error);
      return erryyyyor
    });*/
    this.postgresqlService.getFlow(this.items).subscribe(res=>{
      this.init_point = res.redirect;
        console.log(this.init_point);
        window.open(this.init_point, '_blank');
      });
    /*this.apiMercadopagoService.getMP(this.items).subscribe(res=>{
      this.init_point = res.url;
        console.log(this.init_point);
        window.open(this.init_point, '_blank');
        //window.location.href = this.init_point;
      });*/
  }
}






