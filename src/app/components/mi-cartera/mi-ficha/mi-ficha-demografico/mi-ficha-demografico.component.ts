import { Component, OnInit, Input } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { HttpClient } from '@angular/common/http';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mi-ficha-demografico',
  templateUrl: './mi-ficha-demografico.component.html',
  styleUrls: ['./mi-ficha-demografico.component.css']
})
export class MiFichaDemograficoComponent implements OnInit {
  _afiliado: any;
  isLoading = true;
  isLoadingDetail = true;
  @Input() set afiliado(af:any){
    this.cargasAfiliado = null;
    if(af === null){
      return
    }
    this.isLoading = false;
    if(typeof af.n_carga == 'undefined'){
      af.n_carga = 0;
    }

    this._afiliado = af;

  }
  get afiliado(){
    return this._afiliado;
  }
  @Input() empresa;
  @Input() headers;
  cargasSubscription: Subscription;
  cargas: [];

  IsmodelShow = false;
  lat:number;
  lng:number;
  direccion='';
  comuna='';

  icon = {
    url: 'assets/images/marker.png',
    scaledSize: {
      width: 32,
      height: 32
    }
  }
  constructor(private http: HttpClient, private postgresqlService: PostgresService) {


   }

  ngOnInit() {
    registerLocaleData( es );
  }
  cargasAfiliado = null;


  getCargasFamiliares(){
    if(this.cargasAfiliado ){
      return;
    }
    let date = new Date();
    let day = date.getDate()
    var month = date.getMonth() + 1;
    let year = date.getFullYear();
    if(day < 5){
      month = month -1 < 0 ? 12 : month - 1;
      year = month < 0 ? year-1 : year;
    }
    let monthStr = month < 10 ? `0${month}` :month;
    let periodo_sk = `${year}${monthStr}`;
    this.cargasSubscription = this.postgresqlService.getCargasFamiliaresAfiliado(

    this.afiliado.rut_persona, periodo_sk, this.headers).subscribe(res => {
      this.isLoadingDetail = false;
      this.cargasAfiliado = res;
    },
      error =>{
        console.error(error);
        this.cargasSubscription.unsubscribe();
      }
    );
  }

  showModalCargas(){
    this.getCargasFamiliares();
  }
  getMap(address,comuna){
    this.direccion=address;
    this.comuna=comuna;
    this.IsmodelShow = true;
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ address +', '+ comuna +', Chile&key=AIzaSyAarjPy9Qk9bSEYvwY08o5rA4p_CVzMMSs' )
      .subscribe((res:any)=>{
        this.lat=res.results[0].geometry.location.lat;
        this.lng=res.results[0].geometry.location.lng;

      });

  }
}
