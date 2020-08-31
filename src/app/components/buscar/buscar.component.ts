import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from '../../services/postgres/postgres.service';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { getHeaders, getHeaderStts } from '../utility';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit, OnDestroy {
  usoPPFF: any = [];
  usoCredito: any = [];
  usoAhorro: any = [];
  usoBBSS: any = [];
  usoOferta: any = [];
  usoOferta2: any = [];
  usoOferta3: any = [];
  empresas: any = [];
  bss: any = [];
  userPerfil: any;
  data: any;
  navigationSubscription;
  user: any;
  headers: any;
  ofertaCredDig: any = '';
  user_cla: any;

  constructor(
    public _firestoreservice: FirestoreService,
    private _route: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private postgresService: PostgresService) {

    this.user = this.authService.isUserLoggedIn();
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  ngOnInit() {
    

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
          this.getEmpresaCreditoDetalle(id, this.headers);
          this.getEmpresa(id, this.headers);
          this.getEmpresaAhorroDetalle(id, this.headers);
          this.getEmpresaBeneficios(id, this.headers);
          this.getEmpresaOfertas(id, 'Crédito', 'usoOferta', this.headers);
          this.getEmpresaOfertas(id, 'Ahorro', 'usoOferta2', this.headers);
          this.getEmpresaOfertas(id, 'Beneficios', 'usoOferta3', this.headers);
          this.getOfertaCreditoDigitalEmpresa(id, this.headers);

          const time = new Date();

          const mes = '0' + (time.getMonth() + 1).toString();
          const dia = '0' + (time.getDate()).toString();
      
          this.data = {
            rut_busqueda: parseInt(id),
            rut_colaborador: parseInt(this.user_cla.rut),
            email: this.user_cla.email.toLowerCase(),
            timestamp: parseInt(time.getTime().toString().substr(0, 10)),
            periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
            fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2) + dia.substring(dia.length, dia.length - 2)),
            query: 'empresa',
            modulo: 'BuscarComponent'
          };
      
          this._firestoreservice.createLog('cla_scanner_log', this.data);
        }
      });


    


  }


  private getEmpresaOfertas(id: string, q:string, arrayName:string, headers) {
    this.postgresService.getEmpresaOfertas(id, q, headers).subscribe((ofertas: any) => {
      this[arrayName] = [];
      ofertas.forEach((oferta: any) => {
        this[arrayName].push({
          data: oferta
        });
      });
    });
  }

  private getEmpresaBeneficios(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getEmpresaBeneficios(id, headers).subscribe((empresas: any) => {
      this.usoBBSS = [];
      empresas.forEach((empresa: any) => {
        this.usoBBSS.push({
          data: empresa
        });
      });
    });
  }

  private getEmpresaAhorroDetalle(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getEmpresaAhorroDetalle(id, headers).subscribe((empresas: any) => {
      this.usoAhorro = [];
      empresas.forEach((empresa: any) => {
        this.usoAhorro.push({
          data: empresa
        });
      });
    });
  }

  private getEmpresa(id: string, headers: { headers: HttpHeaders; }) {
    this.postgresService.getEmpresa(id, headers).subscribe((empresa: any) => {
      this.empresas = [];
      this.empresas = empresa[0];
    });
  }

  private getEmpresaCreditoDetalle(id: string, headers) {
    this.postgresService.getEmpresaCreditoDetalle(id, headers).subscribe((empresas: any) => {
      this.usoCredito = [];
      empresas.forEach((empresa: any) => {
        this.usoCredito.push({
          data: empresa
        });
      });
    });
  }

  private getOfertaCreditoDigitalEmpresa(id: string, headers) {
    this.postgresService.getOfertaCreditoDigitalEmpresa(id, headers).subscribe((empresas: any) => {
      if (empresas[0]) {
        this.ofertaCredDig = empresas[0];
    } else {
      this.ofertaCredDig = '';
    }
    });
  }

  logoutUser() {
    this.authService.logout()
      .then(res => {
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');
      }, err => {
        // this.showMessage("danger", err.message);
      });
  }


  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}



