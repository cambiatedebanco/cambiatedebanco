import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, Renderer } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import {  ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FirestoreService } from '../../services/firestore/firestore.service';
import Swal from 'sweetalert2';
import { ApiCardifService } from '../../services/api-cardif/api-cardif.service';
import { getHeaderStts } from '../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';

@Component({
  selector: 'app-oferta-af-aprobprecal',
  templateUrl: './oferta-af-aprobprecal.component.html',
  styleUrls: ['./oferta-af-aprobprecal.component.css']
})
export class OfertaAfAprobprecalComponent implements OnInit {
  @ViewChild('divTestDisplay1', {static: false}) divTestDisplay1: ElementRef;
  @ViewChild('divTestDisplay2', {static: false}) divTestDisplay2: ElementRef;
  @ViewChild('divTestDisplay3', {static: false}) divTestDisplay3: ElementRef;
  @ViewChild('textEmail', {static: false}) textEmail: ElementRef;
  @ViewChild('textFono', {static: false}) textFono: ElementRef;
  @ViewChild('option', {static: false}) option: ElementRef;
  @ViewChild('myModalRedirigeCotizador', {static: false}) myModalRedirigeCotizador: ElementRef;


  @Input('ofertaAfiliado')ofertaAfiliado;
  @Input('rentaImponible')rentaImponible;
  @Input('mora')mora;
  @Input('moraTotal')moraTotal;
  @Input('moraN')moraN;
  @Input('ofertSeguroAuto')ofertSeguroAuto;
  @Input('gestorCampana')gestorCampana;
  @Input('uf')uf;
  @Input('uf_valor')uf_valor;
  @Input('uf_fecha')uf_fecha;
  public radioOf: any;
  public userPerfil: any;
  public data: any;
  navigationSubscription;
  public id: any;
  public dataComunicacion: any;
  public errorFono: string;
  public errorEmail: string;
  public errorOpcion: string;
  sucursales;
  viewOptionOferta = false;
  viewsucursal = true;
  selected: any;
  sucursalObject: any;
  user_cla = null;
  headers = null;
  user = null;
  // tslint:disable-next-line: max-line-length
  constructor( 
    public _firestoreservice: FirestoreService, 
    private _route: Router, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    private apiCardifService: ApiCardifService,
    private renderer: Renderer,
    private postgresService: PostgresService) {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  ngOnInit() {
    registerLocaleData( es );
 }

 paso2() {
  this.sucursalObject = this.sucursales.filter(x => x.sucursal === this.selected)[0];
  if ( typeof this.sucursalObject === 'undefined') {
    Swal.fire({
      title: 'Error',
      text: 'Ingrese sucursal válida',
      type: 'error'
    }).then(() => {});
    return;
  } else {
    this.viewOptionOferta = true;
    this.viewsucursal = false;
    Swal.fire({
      title: 'OK',
      text: 'Cambio realizado',
      type: 'success'
    }).then(() => {});
}

}

paso2Cotizador() {  
  this.sucursalObject = this.sucursales.filter(x => x.sucursal === this.selected)[0];
  if ( typeof this.sucursalObject === 'undefined') {
    Swal.fire({
      title: 'Error',
      text: 'Ingrese sucursal válida',
      type: 'error'
    }).then(() => {});
    return;
  } else {
    Swal.fire({
      title: 'OK',
      text: 'Cambio realizado',
      type: 'success'
    }).then(() => {
      this.redirigeCotizador();
 
    });
}
}

selectSucursalName(name) {

}

  visibleInput(componente: number) {
    
    if (componente == 1) {
      this.divTestDisplay1.nativeElement.style.display = 'block';
      this.divTestDisplay2.nativeElement.style.display = 'none';
      this.divTestDisplay3.nativeElement.style.display = 'none';
      this.textFono.nativeElement.value = '';
      this.option.nativeElement.selectedIndex = 0;
      this.errorEmail = '';
      this.errorOpcion = '';
      this.errorFono = '';

    }
    if (componente == 2) {
      this.divTestDisplay1.nativeElement.style.display = 'none';
      this.divTestDisplay2.nativeElement.style.display = 'block';
      this.divTestDisplay3.nativeElement.style.display = 'none';
      this.textEmail.nativeElement.value = '';
      this.option.nativeElement.selectedIndex = 0;
      this.errorEmail = '';
      this.errorOpcion = '';
      this.errorFono = '';
    }
    if (componente == 3) {
      this.divTestDisplay1.nativeElement.style.display = 'none';
      this.divTestDisplay2.nativeElement.style.display = 'none';
      this.divTestDisplay3.nativeElement.style.display = 'block';
      this.textEmail.nativeElement.value = '';
      this.textFono.nativeElement.value = '';
      this.errorEmail = '';
      this.errorOpcion = '';
      this.errorFono = '';
    }
  }

  initialiseInvites() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];
          this.userPerfil = this.authService.isUserLoggedInPerfil();

          this.selected = this.userPerfil.sucursal;
          this._firestoreservice.getCEOSucursales().subscribe((sucursalesSnapShot: any) => {
            this.sucursales = [];
            sucursalesSnapShot.forEach((sucursal: any) => {
              this.sucursales.push(sucursal.payload.doc.data()
              );
            });
          });
        }
      });



    
  }

  public saveLogCampana() {
    this.viewOptionOferta = false;
    this.viewsucursal = true;
    this.selected = this.userPerfil.sucursal;
    this.divTestDisplay1.nativeElement.style.display = 'none';
    this.divTestDisplay2.nativeElement.style.display = 'none';
    this.divTestDisplay3.nativeElement.style.display = 'none';
    this.textEmail.nativeElement.value = '';
    this.textFono.nativeElement.value = '';
    this.option.nativeElement.selectedIndex = 0;
    this.errorFono = '';
    this.errorEmail = '';
    this.errorOpcion = '';
    this.radioOf = '';

    const time = new Date();

    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();


    this.data = {
      rut_busqueda: parseInt(this.id),
      rut_colaborador: parseInt(this.userPerfil.rut),
      email: this.userPerfil.email.toLowerCase(),
      timestamp: parseInt(time.getTime().toString().substr(0, 10)),
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      query: 'afiliado',
      modulo: 'RevisarCampanaAutoFull'

    };

    this._firestoreservice.createLog('cla_scanner_log', this.data);

  }

  clickHrefCardif(form: any){
    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    
    this.dataComunicacion = {
      rut_cliente: parseInt(this.id),
      rut_colaborador: parseInt(this.userPerfil.rut),
      email_colaborador: this.userPerfil.email.toLowerCase(),
      timestamp: parseInt(time.getTime().toString().substr(0, 10)),
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      modelo_auto: form.modeloAuto.value,
      patente: form.patente.value,
      sucursal: this.sucursalObject.sucursal,
      codigo_sucursal: this.sucursalObject.cod_sucursal,
      form: 'redirigeCardif'
      };
  
    this._firestoreservice.createLog('cla_scanner_seguir_oferta', this.dataComunicacion);
      
    window.open("https://auto.bnpparibascardif.cl/ventaonlineweb/?utm_source=ceocrm&utm_medium=sucursales", "_blank");
  
    }

    redirigeCotizador(){
      const time = new Date();
      const mes = '0' + (time.getMonth() + 1).toString();
      const dia = '0' + (time.getDate()).toString();
      
      this.dataComunicacion = {
        rut_cliente: parseInt(this.id),
        rut_colaborador: parseInt(this.userPerfil.rut),
        email_colaborador: this.userPerfil.email.toLowerCase(),
        timestamp: parseInt(time.getTime().toString().substr(0, 10)),
        periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
        fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
        modelo_auto: '',
        patente: '',
        sucursal: this.sucursalObject.sucursal,
        codigo_sucursal: this.sucursalObject.cod_sucursal,
        form: 'redirigeCotizador'
        };

        this._firestoreservice.createLog('cla_scanner_seguir_oferta', this.dataComunicacion);

        window.open("https://auto.bnpparibascardif.cl/ventaonlineweb/?utm_source=ceocrm&utm_medium=sucursales", "_blank");

    }
    
  registerForm(form: any) {

const time = new Date();

const mes = '0' + (time.getMonth() + 1).toString();
const dia = '0' + (time.getDate()).toString();

if (form.name == 'formFono' && form.textFono.value != '') {
      this.dataComunicacion = {
        rut_cliente: parseInt(this.id),
        rut_colaborador: parseInt(this.userPerfil.rut),
        email_colaborador: this.userPerfil.email.toLowerCase(),
        timestamp: parseInt(time.getTime().toString().substr(0, 10)),
        periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
        fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
        fono: form.textFono.value,
        modelo_auto: form.modeloAuto.value,
        patente: form.patente.value,
        nombres: form.nombreAfiliado.value,
        dv_rut_persona: form.dv_rut_persona.value,
        sucursal: this.sucursalObject.sucursal,
        codigo_sucursal: this.sucursalObject.cod_sucursal,
        form: 'fono'
        };
      this.errorFono = '<strong><div class="text-success animated fadeIn delay-4s">Guardado Exitosamente</div></strong>';
      const dataInsert = {
        rut: this.id + '-' + form.dv_rut_persona.value,
        fecha: dia.substring(dia.length, dia.length - 2) + '-' + mes.substring(mes.length, mes.length - 2) + '-' + time.getFullYear(),
        nombre: form.nombreAfiliado.value,
        telefono: form.textFono.value,
        modelo: form.modeloAuto.value,
      };
      this.apiCardifService.addDataCardif(dataInsert);
    } else {
      this.errorFono = '<strong><div class="text-danger animated fadeIn delay-4s">Favor, Ingrese Fono</div></strong>';
    }

if (form.name == 'formEmail' && form.textEmail.value != '') {
      this.dataComunicacion = {
        rut_cliente: parseInt(this.id),
        rut_colaborador: parseInt(this.userPerfil.rut),
        email_colaborador: this.userPerfil.email.toLowerCase(),
        timestamp: parseInt(time.getTime().toString().substr(0, 10)),
        periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
        fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
        email: form.textEmail.value,
        modelo_auto: form.modeloAuto.value,
        patente: form.patente.value,
        nombres: form.nombreAfiliado.value,
        solo_nombre: (form.nombreAfiliado.value).toString().replace((form.apellido_paternoAfiliado.value).toString() + ' '+ (form.apellido_maternoAfiliado.value).toString(),"").trim(),
        dv_rut_persona: form.dv_rut_persona.value,
        sucursal: this.sucursalObject.sucursal,
        codigo_sucursal: this.sucursalObject.cod_sucursal,
        form: 'email'
        };

      this.errorEmail = '<strong><div class="text-success animated fadeIn delay-4s">Guardado Exitosamente</div></strong>';

      } else {
        this.errorEmail = '<strong><div class="text-danger animated fadeIn delay-4s">Favor, Ingrese Email</div></strong>';
      }

if (form.name == 'formOption' && form.option.selectedIndex != 0) {
      this.dataComunicacion = {
        rut_cliente: parseInt(this.id),
        rut_colaborador: parseInt(this.userPerfil.rut),
        email_colaborador: this.userPerfil.email.toLowerCase(),
        timestamp: parseInt(time.getTime().toString().substr(0, 10)),
        periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
        fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
        opcion: form.option.value,
        modelo_auto: form.modeloAuto.value,
        patente: form.patente.value,
        nombres: form.nombreAfiliado.value,
        dv_rut_persona: form.dv_rut_persona.value,
        sucursal: this.sucursalObject.sucursal,
        codigo_sucursal: this.sucursalObject.cod_sucursal,
        form: 'opciones'
        };
    

      this.errorOpcion = '<strong><div class="text-success animated fadeIn delay-4s">Guardado Exitosamente</div></strong>';

      } else {
        this.errorOpcion = '<strong><div class="text-danger animated fadeIn delay-4s">Favor, Elija una Opción</div></strong>';
      }

this._firestoreservice.createLog('cla_scanner_seguir_oferta', this.dataComunicacion);

  }

}