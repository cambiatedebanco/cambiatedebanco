import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { AuthService } from '../../services/auth.service';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiCardifService } from '../../services/api-cardif/api-cardif.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-auto-referido',
  templateUrl: './auto-referido.component.html',
  styleUrls: ['./auto-referido.component.css']
})

export class AutoReferidoComponent implements OnInit {
  referidoForm;
  @Input() oferta: any;
  @Input() afiliado: any;
  @Input() valorUf: any;
  @Input() indice: any;
  @Input() contactForm;
  @Output() mailStatusEmmiter = new EventEmitter<any>();
  @Output() wrongMailFocus = new EventEmitter<any>();
  isInvalid = false;
  isRefered = false;
  user;
  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public firestoreservice: FirestoreService,
    public authService: AuthService,
    private _router: Router,
    private apiCardifService: ApiCardifService,
    private postgresService: PostgresService
  ) {
   }


  ngOnInit() {
    registerLocaleData( es );
    this.setUser();
    this.referidoForm = this.formBuilder.group({
      deducible: '5_' + this.oferta.data.deducible_5,
    });
    // Escucha los cambios del formulario de contacto y fuerza validar por el mail.
    this.contactForm.controls.correo_elect.clearValidators();
    this.contactForm.controls.correo_elect.setValidators([Validators.required, Validators.email]);
    this.contactForm.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
      if (this.indice === 0 ) {
        this.checkEmailContact();
      }
    });
    this.checkReferedPatent(this.oferta.data.patente);
  }

  checkEmailContact() {
    let obj = {emailFormat: false, emailRequired: false};
    if (this.contactForm.invalid) {
      // Puede ser indefinido.
      const emailFormat = this.contactForm.controls.correo_elect.errors.email === true ? true : false;
      const emailRequired = this.contactForm.controls.correo_elect.errors.required === true ? true : false;
      obj = {
        emailFormat,
        emailRequired
      };
    }
    this.mailStatusEmmiter.emit(obj);
  }

  checkReferedPatent(patente: string) {
    this.firestoreservice.getCarPatentRefered(patente).subscribe((data: any) => {
      this.isRefered =  data.length > 0;
    });
  }

  submitReferido() {
    if (this.isRefered) {
      this.swalFire('Disculpa!', 'Ya se encuentra referido', 'warning');
      return;
    }
    let payload = this.referidoForm.value;
    const splits = payload.deducible.split('_');
    if (splits.length > 1) {
      payload.valor_deducible = splits[0];
      payload.valor_seguro = splits[1];
    }
    if (this.contactForm.invalid) {
      this.wrongMailFocus.emit();
      return;
    }
    payload = this.preparePayload(payload);
    this.authService.getestado();
    let headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.postgresService.getUsuarioPorMail(this.user.email.toUpperCase(), headers).subscribe(
      resp => {if(resp){
        let temp = resp[0]
        payload.rut_colaborador = temp.rut;
        payload.nombre_colaborador = temp.nombres;
        const mes = '0' + (payload.create_time.getMonth() + 1).toString();
        const dia = '0' + (payload.create_time.getDate()).toString();
        const dataInsert = {
          rut: payload.rut_referido + '-' + payload.dv_referido,
          fecha: dia.substring(dia.length, dia.length - 2) + '-' + mes.substring(mes.length, mes.length - 2) + '-' + payload.create_time.getFullYear(),
          nombre: payload.nombre_referido,
          telefono: payload.FONO_MOVIL + ''  || '',
          modelo: payload.modelo_auto,
        };
        this.firestoreservice.createReferidoAuto(payload);
        this.apiCardifService.addDataCardif(dataInsert);
      }}
    )
    this.swalFire('OK', 'Hemos ingresado su Referido', 'success');
    this._router.navigate([`/referidos-auto-lista`]);
  }


  ngOnChanges(changes) {
  }
  swalFire(title: string, text: string, type: any) {
    Swal.fire({
      title,
      text,
      type
    }).then(() => {});
  }

  setUser() {
    this.user = this.authService.isUserLoggedIn();
  }
  preparePayload(payload) {
    const date = new Date();
    payload.nombre_referido = this.afiliado.data.nombres;
    payload.fecha_nacimiento_persona = this.afiliado.data.fecha_nacimiento_persona;
    payload.correo_elect_persona = this.contactForm.value.correo_elect.toUpperCase();
    payload.FONO_MOVIL = this.contactForm.value.FONO_MOVIL;
    payload.marca_auto = this.oferta.data.MARCA_AUTO || '';
    payload.modelo_auto = this.oferta.data.modelo_auto;
    payload.patente = this.oferta.data.patente.toUpperCase() || '';
    payload.anio = this.oferta.data.YEAR || '';
    payload.rut_referido = parseInt(this.afiliado.id, 0);
    payload.dv_referido = this.afiliado.data.dv_rut_persona;
    payload.create_time = date;
    payload.timeStamp = parseInt(date.getTime().toString().substring(0, 10), 0);
    payload.nuevo = 0;
    payload.predeterminado = this.oferta.data.predeterminado;
    if (this.oferta.data.MODELO_AUTO === '') {
      payload.modelo_auto = payload.marca + '-' + payload.modelo_auto.toUpperCase();
    }

    return payload;
  }

}

