import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { getHeaders } from '../../utility';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { ApiCardifService } from '../../../services/api-cardif/api-cardif.service';

@Component({
  selector: 'app-form-auto-full',
  templateUrl: './form-auto-full.component.html',
  styleUrls: ['./form-auto-full.component.css']
})
export class FormAutoFullComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('closebuttonAutoFull', null) closebuttonAutoFull;
  @Output() completeGestion = new EventEmitter<boolean>();
  @Input() rut;
  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
  }
  get afiliado() {
    return this._afiliado;
  }
  _afiliado: any;
  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }
  _ejecutivo: any;
  submitted = null;
  user = null;
  userPerfil = null;
  headers: any;
  ufData = {valor: null, fecha: null};
  autoFull: any;
  fonoFormGroup: FormGroup;
  webFormGroup: FormGroup;
  interesFormGroup: FormGroup;
  options: any;
  accion: string;
  dataComunicacion: any;
  navigationSubscription: Subscription;
  getAutoFullMiFichaSubscription: Subscription;
  getUfSubscription: Subscription;
  getCEOSucursalesSubscription: Subscription;
  sucursales;
  viewOptionOferta = false;
  viewsucursal = true;
  selected: any;
  sucursalObject: any;

  constructor(private firestoreservice: FirestoreService,
              private formBuilder: FormBuilder,
              private postgresService: PostgresService,
              private authService: AuthService,
              private apiCardifService: ApiCardifService,
              private router: Router) {
                this.navigationSubscription = this.router.events.subscribe((e: any) => {
                  // If it is a NavigationEnd event re-initalise the component
                  if (e instanceof NavigationEnd) {
                    this.initialiseInvites();
                  }
                });
              }

 initialiseInvites() {

    this.fonoFormGroup = this.formBuilder.group({
      telefono: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,10}')])
    });
    this.webFormGroup = this.formBuilder.group({
      email: new FormControl(null, [Validators.required])
    });
    this.interesFormGroup = this.formBuilder.group({
      option: new FormControl(null, [Validators.required])
    });

    this.options = [
      {option: 'No es mi auto', name: 'No es mi auto'},
      {option: 'Precio', name: 'Precio'},
      {option: 'Otro', name: 'Otro'},
    ];



  }

  ngOnInit() {
    this.userPerfil = this.authService.isUserLoggedInPerfil();
    this.selected = this.userPerfil.SUCURSAL;
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user;
                                  this.headers = getHeaders(user);} })
    ).subscribe(
      _ => {
        this.getCEOSucursales();
        this.getUf();
        this.getAutoFull(this.rut, this.headers);
      }
    );
  }

  ngOnChanges(){
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user;
                                  this.headers = getHeaders(user);} })
    ).subscribe(
      _ => {
        this.getUf();
        this.getAutoFull(this.rut, this.headers);
      }
    );
  }


  getAutoFull(id: string, headers: any) {
    this.getAutoFullMiFichaSubscription = this.postgresService.getAutoFullMiFicha(id , headers).subscribe((autoFull: any) => {
      this.autoFull = autoFull[0];
    });

  }

  onSubmitFono() {
    if (this.fonoFormGroup.invalid) {
      return;
    }
    let formData = this.fonoFormGroup.value;
    const time = new Date();
    const timeStamp = parseInt(time.getTime().toString().substring(0, 10), 0);

    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();

    this.dataComunicacion = {
      rut_cliente: parseInt(this._afiliado.rut_persona),
      rut_colaborador: parseInt(this._ejecutivo.RUT),
      email_colaborador: this._ejecutivo.EMAIL.toLowerCase(),
      timestamp: timeStamp,
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      fono: formData.telefono,
      modelo_auto: this.autoFull.modelo_auto,
      patente: this.autoFull.patente,
      nombres: this._afiliado.nombres,
      dv_rut_persona: this._afiliado.dv_rut_persona,
      sucursal: this.sucursalObject.sucursal,
      codigo_sucursal: this.sucursalObject.cod_sucursal,
      form: 'fono'
      };
    const dataInsert = {
      rut: this._afiliado.rut_persona + '-' + this._afiliado.dv_rut_persona,
      fecha: dia.substring(dia.length, dia.length - 2) + '-' + mes.substring(mes.length, mes.length - 2) + '-' + time.getFullYear(),
      nombre: this._afiliado.nombres,
      telefono: formData.telefono,
      modelo: this.autoFull.modelo_auto,
      };
    this.apiCardifService.addDataCardif(dataInsert);
    this.saveLog('cla_scanner_seguir_oferta', this.dataComunicacion);
    this.saveTimeline(formData);

  }
  onSubmitWeb() {
    if (this.webFormGroup.invalid) {
      return;
    }
    let formData = this.webFormGroup.value;
    const time = new Date();
    const timeStamp = parseInt(time.getTime().toString().substring(0, 10), 0);

    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    this.dataComunicacion = {
      rut_cliente: parseInt(this._afiliado.rut_persona),
      rut_colaborador: parseInt(this._ejecutivo.RUT),
      email_colaborador: this._ejecutivo.EMAIL.toLowerCase(),
      timestamp: parseInt(time.getTime().toString().substr(0, 10)),
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      email: formData.email,
      modelo_auto: this.autoFull.modelo_auto,
      patente: this.autoFull.patente,
      nombres: this._afiliado.nombres,
      solo_nombre: (this._afiliado.nombres).toString().replace((this._afiliado.apellido_paterno).toString() + ' '+ (this._afiliado.apellido_materno).toString(),"").trim(),
      dv_rut_persona: this._afiliado.dv_rut_persona,
      sucursal: this.sucursalObject.sucursal,
      codigo_sucursal: this.sucursalObject.cod_sucursal,
      form: 'email'
      };
    this.saveLog('cla_scanner_seguir_oferta', this.dataComunicacion);
    this.saveTimeline(formData);
  }

  onSubmitInteres() {
    if (this.interesFormGroup.invalid) {
      return;
    }
    let formData = this.interesFormGroup.value;
    const time = new Date();
    const timeStamp = parseInt(time.getTime().toString().substring(0, 10), 0);

    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    this.dataComunicacion = {
      rut_cliente: parseInt(this._afiliado.rut_persona),
      rut_colaborador: parseInt(this._ejecutivo.RUT),
      email_colaborador: this._ejecutivo.EMAIL.toLowerCase(),
      timestamp: parseInt(time.getTime().toString().substr(0, 10)),
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      opcion: formData.option,
      modelo_auto: this.autoFull.modelo_auto,
      patente: this.autoFull.patente,
      nombres: this._afiliado.nombres,
      dv_rut_persona: this._afiliado.dv_rut_persona,
      sucursal: this.sucursalObject.sucursal,
      codigo_sucursal: this.sucursalObject.cod_sucursal,
      form: 'opciones'
      };

    this.saveLog('cla_scanner_seguir_oferta', this.dataComunicacion);
    this.saveTimeline(formData);
  }

  clickHrefCardif() {
    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();

    this.dataComunicacion = {
        rut_cliente: parseInt(this._afiliado.rut_persona),
        rut_colaborador: parseInt(this._ejecutivo.RUT),
        email_colaborador: this._ejecutivo.EMAIL.toLowerCase(),
        timestamp: parseInt(time.getTime().toString().substr(0, 10)),
        periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
        fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
        modelo_auto: this.autoFull.modelo_auto,
        patente: this.autoFull.patente,
        sucursal: this.sucursalObject.sucursal,
        codigo_sucursal: this.sucursalObject.cod_sucursal,
        form: 'redirigeCardif'
        };

    this.saveLog('cla_scanner_seguir_oferta', this.dataComunicacion);

    }

  saveLog(collection: string, data: any) {
    this.firestoreservice.createLog(collection, data);
}

saveTimeline(formData: any) {

  let comentario = null;
  if (formData.telefono) {
    comentario = 'Afiliado desea ser contactado vía teléfono';
  }
  if (formData.email) {
    comentario = 'Afiliado desea continuar oferta vía Web';
  }
  if (formData.option) {
    comentario = 'Afiliado No esta interesado en la oferta';
  }
  const time = new Date();
  //time.setHours(time.getHours()-4);
  formData.rut_persona = this._afiliado.rut_persona;
  formData.ejecutivo = this._ejecutivo.EMAIL.toLowerCase();
  formData.id_operador = this._ejecutivo.RUT,
  formData.canal = 'CEO';
  formData.tipo_gestion = 'Seguro';
  formData.comentarios = comentario;
  formData.fechaContacto = time;
  formData.tipo_interaccion = 'Atiende Ejecutivo';
  formData.campana = 'Auto Full';
  formData.estado_gestion = 'Gestionado';

  this.postgresService.saveTimeLine(formData, this.headers).subscribe(res => console.log(res),
  err => {
    console.log(err)
  },
  ()=> {
    console.log("complete")
    this.sendCompleteForm();
    this.closeModaAutoFull();
    Swal.fire({
      title: 'OK',
      text:'Se Actualiza correctamente',
      type: 'success'
    }).then( function() {

    });

  }
)
}

sendCompleteForm() {
  this.fonoFormGroup.setControl('telefono',new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,10}')]))
  this.webFormGroup.setControl('email', new FormControl(null, [Validators.required]))
  this.interesFormGroup.setControl('option', new FormControl(null, [Validators.required]))
  this.accion = null;
  this.completeGestion.emit(true);
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

  getUf() {
    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();

    const fechaString = time.getFullYear() + '-' +
    mes.substring(mes.length, mes.length - 2)  + '-' +
    dia.substring(dia.length, dia.length - 2);

    this.getUfSubscription = this.firestoreservice.getUf(fechaString).subscribe((ufSnap: any) => {
      ufSnap.forEach((uf: any) => {
        this.ufData.valor = parseFloat(uf.payload.doc.data().UF);
        this.ufData.fecha = uf.payload.doc.data().FECHA;
      });
    });
  }

  getCEOSucursales() {
    this.getCEOSucursalesSubscription = this.firestoreservice.getCEOSucursales().subscribe((sucursalesSnapShot: any) => {
    this.sucursales = [];
    sucursalesSnapShot.forEach((sucursal: any) => {
      this.sucursales.push(sucursal.payload.doc.data()
      );
    });
  });
  }

  closeModaAutoFull(){
    this.viewOptionOferta = false;
    this.viewsucursal = true;
    this.selected = this.userPerfil.SUCURSAL;
    this.accion = null;
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    this.autoFull= null;
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }

    if (this.getAutoFullMiFichaSubscription) {
      this.getAutoFullMiFichaSubscription.unsubscribe();

    }

    if (this.getUfSubscription) {
      this.getUfSubscription.unsubscribe();
    }

    if (this.getCEOSucursalesSubscription) {
      this.getCEOSucursalesSubscription.unsubscribe();
    }
    
    this.closebuttonAutoFull.nativeElement.click();
  }

}
