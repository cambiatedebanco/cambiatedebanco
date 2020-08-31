import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import {  ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostgresService } from '../../services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import {getHeaders, getHeaderStts} from '../utility';

@Component({
  selector: 'app-buscar-afiliado',
  templateUrl: './buscar-afiliado.component.html',
  styleUrls: ['./buscar-afiliado.component.css']
})
export class BuscarAfiliadoComponent implements OnInit, OnDestroy {
  public ofertaCredito: any = [];
  public ofertaAhorro: any = [];
  public ofertaBeneficios: any = [];
  public ofertaAprobPrecal: any = [];
  public ofertaSeguros: any = [];
  public afiliados: any = [];
  public mora: any = [];
  public bss: any = [];
  public data: any;
  public moraTotal: number;
  public moraN: number;
  navigationSubscription;
  public userPerfil: any;
  public ofertSeguroAuto: any = [];
  public gestorCampana: any = [];
  public uf: any = [];
  public uf_valor: any = [];
  public uf_fecha: any = [];
  user: any;
  headers: any;
  user_cla = null;
  constructor(
    public _firestoreservice: FirestoreService,
    private _route: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private postgresService: PostgresService) {
      // TO DO
      this.user = this.authService.isUserLoggedIn();
      this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
   }


   initialiseInvites() {
    const id = this.route.snapshot.paramMap.get('id');

    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];
          this.userPerfil = this.authService.isUserLoggedInPerfil();
          this.getAfiliado(id, this.headers );
          this.getAfiliadoOfertasBbssApi(id, this.headers );
          this.getAfiliadoMora(id, this.headers );
          this.getAfiliadoAprobadoPrecalificado(id, this.headers );
          this.getAfiliadoOfertaEfi(id, this.headers );
          this.getAfiliadoOfertasAhorro(id, this.headers );
          this.getAfiliadoRecomendacionSeguro(id, this.headers );
          this.getAfiliadoAutoFull(id, this.headers );

          const time = new Date();

          const mes = '0' + (time.getMonth() + 1).toString();
          const dia = '0' + (time.getDate()).toString();
          const fechaString = time.getFullYear() + '-' + mes.substring(mes.length, mes.length - 2)  + '-' + dia.substring(dia.length, dia.length - 2);
      
          this.data = {
            rut_busqueda: parseInt(id),
            rut_colaborador: parseInt(this.userPerfil.rut),
            email: this.userPerfil.email.toLowerCase(),
            timestamp: parseInt(time.getTime().toString().substr(0, 10)),
            periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
            fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
            query: 'afiliado',
            modulo: 'BuscarAfiliadoComponent'
      
          };
          this._firestoreservice.createLog('cla_scanner_log', this.data);
          this._firestoreservice.getUf(fechaString).subscribe((ufSnap: any) => {
            ufSnap.forEach((uf: any) => {
              this.uf_valor = parseFloat(uf.payload.doc.data().UF);
              this.uf_fecha = uf.payload.doc.data().FECHA;
            });
          });
        }
      });

  }

  private getAfiliadoAutoFull(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getAfiliadoAutoFull(id, headers).subscribe((afiliados: any) => {
      this.ofertSeguroAuto = [];
      let correoPersona: string;
      this.gestorCampana = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertSeguroAuto.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliadoRecomendacionSeguro(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getAfiliadoRecomendacionSeguro(id, headers).subscribe((afiliados: any) => {
      this.ofertaSeguros = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertaSeguros.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliadoOfertasAhorro(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getAfiliadoOfertasAhorro(id, headers).subscribe((afiliados: any) => {
      this.ofertaAhorro = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertaAhorro.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliadoOfertaEfi(id: string, headers) {
    this.postgresService.getAfiliadoOfertaEfi(id, headers).subscribe((afiliados: any) => {
      this.ofertaCredito = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertaCredito.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliadoAprobadoPrecalificado(id: string, headers) {
    this.postgresService.getAfiliadoAprobadoPrecalificado(id, headers).subscribe((afiliados: any) => {
      this.ofertaAprobPrecal = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertaAprobPrecal.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliadoMora(id: string, headers) {
    this.postgresService.getAfiliadoMora(id, headers).subscribe((afiliados: any) => {
      this.mora = [];
      this.moraTotal = 0;
      this.moraN = 0;
      afiliados.forEach((afiliado: any) => {
        this.mora.push({
          data: afiliado
        });
        this.moraTotal = this.moraTotal + parseInt(afiliado.mora_op);
        this.moraN++;
      });
    });
  }

  private getAfiliadoOfertasBbssApi(id: string, headers) {
    this.postgresService.getAfiliadoOfertasBbss(id, headers).subscribe((afiliados: any) => {
      this.ofertaBeneficios = [];
      afiliados.forEach((afiliado: any) => {
        this.ofertaBeneficios.push({
          data: afiliado
        });
      });
    });
  }

  private getAfiliado(id: string, headers) {
    this.postgresService.getAfiliado(id , headers).subscribe((afiliado: any) => {
      this.afiliados = [];
      this.afiliados = afiliado[0];
    });
  }

  ngOnInit() {


  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }


  logoutUser() {
    this.authService.logout()
      .then(res => {
        // this.userDetails = undefined;
      //  this.userPerfil= undefined;
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');

      }, err => {
        // this.showMessage("danger", err.message);
      });
  }


}
