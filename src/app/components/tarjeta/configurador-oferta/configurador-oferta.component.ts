import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configurador-oferta',
  templateUrl: './configurador-oferta.component.html',
  styleUrls: ['./configurador-oferta.component.css']
})
export class ConfiguradorOfertaComponent implements OnInit, OnDestroy {
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

    @Input() set creditos(creditos) {
    this._creditos= creditos;

  }
  get creditos() {
    return this.creditos;
  }
  _creditos: any;
  constructor(private postgresqlService: PostgresService) { }
  cantidad = []; 
  monto_compra=0;
  init_point: any;
  items: any;
  cantidadBolsa = 0;
  cantidadMonedas = 0;
  subsFlow: Subscription;
  headers=null;
  userPerfil=null;

  ngOnInit() {
    this.cantidad = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  }

  onChange(e){
    const params = e.split('-');
    this.cantidadBolsa = parseInt(params[0]);
    this.cantidadMonedas = parseInt(params[2]) * this.cantidadBolsa;
    this.monto_compra = this.cantidadBolsa * parseInt(params[1]);
    this.userPerfil = JSON.parse(localStorage.getItem('user_perfil'));
    console.log(this.monto_compra);
  }


  onBuy() {
    if(this.monto_compra === 0){
      return;
    }

    this.items = {
      email: this._user.email.toLowerCase(),
      rut: this.userPerfil.rut + '-' + this.userPerfil.dv,
      monto: this.monto_compra,
      cantidad_monedas: this.cantidadMonedas
    }

  
    this.subsFlow = this.postgresqlService.getFlow(this.items).subscribe(res=>{
       this.init_point = res.redirect;
       console.log(this.init_point);
       window.open(this.init_point, '_blank');
       });

   }
   ngOnDestroy(): void {

    if (this.subsFlow ) {
      this.subsFlow.unsubscribe();
    }
   }
}
