import { Component, OnInit, Input } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';

@Component({
  selector: 'app-configurador-oferta',
  templateUrl: './configurador-oferta.component.html',
  styleUrls: ['./configurador-oferta.component.css']
})
export class ConfiguradorOfertaComponent implements OnInit {
  @Input() set oferta(oferta) {
    this._oferta= oferta;
  }
  get oferta() {
    return this._oferta;
  }
  _oferta: any;

  @Input() set user(user) {
    this._user= user;
  }
  get user() {
    return this._user;
  }
  _user: any;
  constructor(private postgresqlService: PostgresService) { }
  cantidad = []; 
  monto_compra=0;
  indice=null;
  init_point: any;
  items: any;
  cantidadLingotes=0;
  ngOnInit() {
    this.cantidad = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  }

  onChange(e){
    const params = e.split('-');
    this.cantidadLingotes = parseInt(params[0]);
    this.monto_compra = this.cantidadLingotes * parseInt(params[1]);
    console.log(this.monto_compra);
  }

  onBuy() {
    if(this.monto_compra === 0){
      return;
    }
    /* this.checkoutService.goCheckOut(this.preference).then(result => {
       // Read result of the Cloud Function.
       this.init_point = result.data.result;
       console.log(this.init_point);
       //window.location.href = this.init_point;
     }).catch(error => {
       console.log(error);
       return erryyyyor
     });*/
    this.items = {
      email: this._user.email.toLowerCase(),
      rut: this._user.rut + '-' + this._user.dv,
      rutint: this._user.rut,
      monto: this.monto_compra,
      cantidad: this.cantidad
    }

    this.postgresqlService.getFlow(this.items).subscribe(res=>{
       this.init_point = res.redirect;
       console.log(this.init_point);
       window.open(this.init_point, '_blank');
       });

   }

}
