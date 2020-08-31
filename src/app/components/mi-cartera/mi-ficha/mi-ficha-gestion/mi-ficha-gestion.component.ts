import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgModule, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import { getHeaders, getHeaderStts } from '../../../utility';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';


import Swal from 'sweetalert2';
import { DialogEmail } from 'src/app/dialogs/dialog-email';


const datePipe = new DatePipe('es-Cl');

@Component({
  selector: 'app-mi-ficha-gestion',
  templateUrl: './mi-ficha-gestion.component.html',
  styleUrls: ['./mi-ficha-gestion.component.css']
})
export class MiFichaGestionComponent implements OnInit, OnDestroy {

  authSubscription: Subscription;
  estadoSubscription: Subscription;
  getEstadosLeadsSubscription: Subscription;
  _ejecutivo = null;
  @Input() rut;
  _detailObjectPPFF = null;

  @Input() set detailObjectPPFF(detailObjectPPFF) {
    this._detailObjectPPFF = detailObjectPPFF;
  }
  get detailObjectPPFF() {
    return this._detailObjectPPFF;
  }


  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
    if (this._afiliado) {
      this.prepareHeaders();
      this.prepareTestForm();
    }
  }

  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }


  carteraEstado = false;
  get afiliado() {
    return this._afiliado;
  }
  @Output() completeGestion = new EventEmitter<boolean>();
  _afiliado: any;
  testFromGroup: FormGroup;
  estados: any;
  estado = null;
  submitted = null;
  user = null;
  user_cla = null;
  headers = null;
  cambioEstado;
  minutes: any[] = [0, 15, 30, 45];
  hours: any[] = [];
  meridianos: string[] = ['AM', 'PM']
  now = new Date();
  id_estado = null;
  selectedEstado = null;
  isMonto: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private postgresService: PostgresService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog
  ) { }
  ngOnInit() {
    registerLocaleData(es);
    this.testFromGroup = this.formBuilder.group({
      rut: new FormControl({ value: '', disabled: true }),
      nombres: new FormControl({ value: '', disabled: true }),
      estado: new FormControl(null, [Validators.required]),
      monto: new FormControl('0'),
      comentarios: new FormControl({ value: '' }),
      email: new FormControl(null),
      telefono: new FormControl(null),
      fechaAgendamiento: new FormControl(this.now),
      horaAgendamiento: new FormControl()
    });

  }

  ngOnDestroy() {
    if (typeof this.estadoSubscription !== 'undefined') {
      this.estadoSubscription.unsubscribe();
    }
    if (typeof this.getEstadosLeadsSubscription !== 'undefined') {
      this.getEstadosLeadsSubscription.unsubscribe();
    }
  }

  prepareTestForm() {
    let email = this.getValueOrNull(this._afiliado.correo_elect_persona);
    let telefono = this.getValueOrNull(this._afiliado.fono_movil);
    this.testFromGroup = this.formBuilder.group({
      rut: new FormControl({ value: this._afiliado.rut_persona, disabled: true }),
      nombres: new FormControl({ value: this._afiliado.nombres, disabled: true }),
      estado: new FormControl(null, [Validators.required]),
      email: new FormControl(email, [Validators.required]),
      telefono: new FormControl(telefono, [Validators.pattern('[0-9]{1,14}')]),
      monto: new FormControl('0'),
      comentarios: new FormControl(null),
      fechaAgendamiento: new FormControl(this.now),
      horaAgendamiento: new FormControl()
    });

    this.estadoSubscription = this.testFromGroup.get('estado').valueChanges.subscribe(value=> {
      this.selectedEstado = this.estados.filter(data => data.idestado === value.idestado );

      if (value.idestado === 5 || value.idestado === 12) {
        this.isMonto = true;
      } else {
        this.isMonto = false;
      }
      if (value.idestado === this.estados[14].idestado) {
        this.testFromGroup.setControl('fechaAgendamiento', new FormControl(this.now, [Validators.required]))
        this.testFromGroup.setControl('horaAgendamiento', new FormControl(null, [Validators.required]))
        return;
      }
      this.testFromGroup.setControl('fechaAgendamiento', new FormControl(this.now));
      this.testFromGroup.setControl('horaAgendamiento', new FormControl(null));
    })
  }

  onSubmit() {
    if (this.testFromGroup.invalid) {
      console.log("formulario no valido ")
      console.log(this.testFromGroup.invalid)
      const result = [];
      Object.keys(this.testFromGroup.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.testFromGroup.get(key).errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            result.push({
              'control': key,
              'error': keyError,
              'value': controlErrors[keyError]
            });
          });
        }
      });
      console.log(result);
      return;
    }




    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    const periodo = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2));
    const fecha = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2) + '' + dia.substring(dia.length, dia.length - 2));
    //time.setHours(time.getHours() - 4);

    let formData = this.testFromGroup.value;
    formData.rut_persona = this._afiliado.rut_persona;
    formData.nombres = this._afiliado.nombres;
    formData.ejecutivo = this.user.email;
    formData.fechaContacto = time;
    formData.id_operador = this._ejecutivo.rut,
    formData.tipo_gestion = 'Crédito',
    formData.tipo_interaccion = 'Atiende Ejecutivo',
    formData.campana = 'PreAprobado',
    formData.estado_gestion = 'Gestionado - ' + this.selectedEstado[0].nombre_estado,
    formData.canal = 'CEO'

    if(formData.horaAgendamiento){
      this.insertEventCalendar(formData);
    }

    let monto = 0;
    let re = /\./gi;
    let re2 = /\,/gi;
    let re3 = /\-/gi;
    if (formData.monto) {
      monto = formData.monto == undefined ? 0 : (isNaN(parseInt(String(formData.monto).replace(re, '').replace(re2, '').replace(re3, ''))) ? 1 : parseInt(String(formData.monto).replace(re, '').replace(re2, '').replace(re3, '')));
    }

    const dataUpdate = {
      fecha_date_gestion: time,
      periodo_gestion: periodo,
      fecha_gestion: fecha,
      rut_persona: this._afiliado.rut_persona,
      id_estado: this.selectedEstado[0].idestado,
      monto_cursado: formData.monto,
      observaciones: formData.comentarios ||''
    };

    

    this.updateBaseLeads(dataUpdate);
    this.saveTimeline(formData);

  }

  getEstadosLeads(headers: any) {
    this.getEstadosLeadsSubscription = this.postgresService.getEstadosLeads(headers).subscribe((estados: any) => {
      this.estados = estados;
    });

  }

  private insertEventCalendar(formData: any) {
    let description = `Contactar afiliado ${formData.nombres} al numero ${formData.telefono}, rut ${formData.rut_persona}. Comentarios : ${
      formData.comentarios
      }`;

    let horaFechaArray = formData.horaAgendamiento.split(":");
    let minutoMerdiano = horaFechaArray[1].split(" ");
    let meridiano = minutoMerdiano[1];
    let minutos = parseInt(minutoMerdiano);
    let hora = parseInt(horaFechaArray[0]);
    let fecha = new Date(formData.fechaAgendamiento);
    hora = this.get24Hours(meridiano, hora)
    fecha.setHours(hora);
    fecha.setMinutes(minutos);


    let url = `http://localhost:4200/#/mi-ficha/${formData.rut_persona}`;

    this.authService.insertEvents(description, fecha.toISOString(), 'Volver a llamar', url, formData.email);
  }

  get24Hours(meridiano, hora) {
    return meridiano === this.meridianos[0] ? hora : hora + 12;
  }

  saveTimeline(formData) {
    this.postgresService.saveTimeLine(formData, this.headers).subscribe(res =>

      console.log(res),

      err => {
        console.error(err)
      },
      () => {
        
        this.sendCompleteForm();
      }
    )
  }

  updateBaseLeads(data) {
    this.postgresService.updateBaseLeads(data, this.headers).subscribe(res => console.log(res),
      err => {
        console.error(err)
        Swal.fire({
          title: 'Ups!',
          text: 'Algo salio mal!',
          type: 'success'
        }).then(() => {});
        this.completeGestion.emit(true);
      },
      () => {
        console.log("check")
        this.sendCompleteForm();
      }
    )
  }

  saveLog(collection: string, data: any) {
    this.firestoreService.createLog(collection, data);
  }

  getValueOrNull(param) {
    return typeof param === 'undefined'
      ? null
      : param
  }

  prepareHeaders() {
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.user =this.authService.isUserLoggedIn();
    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];
          this.getEstadosLeads(this.headers);
        }
      });
  }

  sendCompleteForm() {
    this.isMonto = false;
    this.prepareTestForm();
    /*this.testFromGroup.setControl('monto',new FormControl('0'))
    this.testFromGroup.setControl('estado', new FormControl(null, [Validators.required]))
    this.testFromGroup.setControl('comentarios',new FormControl(null))*/
    
    Swal.fire({
      title: 'OK',
      text: 'gestionado!',
      type: 'success'
    }).then(() => {});
    this.completeGestion.emit(true);
  }

  openDialogMail(): void {
    this.completeGestion.emit(false);
    const dialogRef = this.dialog.open(DialogEmail, {
      width: '650px',
      data: {
        to: this.getValueOrNull(this._afiliado.correo_elect_persona),
        from: this._ejecutivo.email,
        script: 'check',
        afiliado: this.afiliado,
        ejecutivo: this._ejecutivo, oferta: this._detailObjectPPFF
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dataTimeline = {
          rut_persona: this._afiliado.rut_persona,
          ejecutivo: this._ejecutivo.email.toLowerCase(),
          id_operador: this._ejecutivo.rut,
          canal: 'CEO',
          tipo_gestion: 'oferta',
          comentarios: 'Se envía mail al afiliado acerca de ' + this._detailObjectPPFF.tipo_producto + ' ' + this._detailObjectPPFF.oferta,
          fechaContacto: new Date(),
          tipo_interaccion: 'Atiende Ejecutivo',
          campana: '',
          estado_gestion: 'Informado'
        };
        this.postgresService.saveTimeLine(dataTimeline, this.headers).subscribe(res => console.log(res),
          err => {
            console.log(err);
          },
          () => {
            console.log('complete');
            this.completeGestion.emit(true);
          });
        const time = new Date()
        const mes = '0' + (time.getMonth() + 1).toString();
        const dia = '0' + (time.getDate()).toString();
        const periodo = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2));
        const fecha = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2) + '' + dia.substring(dia.length, dia.length - 2));
        const dataUpdate = {
          fecha_date_gestion: new Date(),
          periodo_gestion: periodo,
          fecha_gestion: fecha,
          rut_persona: this._afiliado.rut_persona,
          id_estado: 17,
          monto_cursado: 0,
          observaciones: 'Se envía mail'
        };


        this.updateBaseLeads(dataUpdate);
      }
    })
  }

}
