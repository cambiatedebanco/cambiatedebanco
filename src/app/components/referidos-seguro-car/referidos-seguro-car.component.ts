import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { PostgresService } from '../../services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import {getHeaders} from '../utility';
import { ApiCardifService } from '../../services/api-cardif/api-cardif.service';

@Component({
  selector: 'app-referidos-seguro-car',
  templateUrl: './referidos-seguro-car.component.html',
  styleUrls: ['./referidos-seguro-car.component.css']
})

export class ReferidosSeguroCarComponent implements OnInit {
  searchForm;
  contactForm;
  sinAutoForm;
  afiliado = null;
  submitted = false;
  isContactFormInValid = {emailFormat: false, emailRequired: false};
  isAfiliado = true;
  ofertSeguroAuto = [];
  dummyMarcas = [];
  valorUf: any;
  uf_fecha: any;
  indice: any;
  referidoForm;
  private headers: any;
  private user: any;


  constructor(
    private formBuilder: FormBuilder,
    public firestoreservice: FirestoreService,
    public authService: AuthService,
    private _router: Router,
    private postgresService: PostgresService,
    private apiCardifService: ApiCardifService
    ) {
    this.searchForm = this.formBuilder.group({rut: ''});
  }

  ngOnInit() {
    this.sinAutoForm = this.formBuilder.group(
      {
        marca: new FormControl('', [Validators.required]),
        modelo_auto: new FormControl('', [Validators.required]),
        anio: new FormControl(2005, [Validators.required, Validators.min(2005)]),
        patente: new FormControl('', [Validators.required]),
        FONO_MOVIL: '',
        correo_elect_persona: new FormControl('dummy@mail.com', [Validators.required, Validators.email]),
        nombre_referido: new FormControl({disabled: true}, Validators.required),
        fecha_nacimiento_persona: new FormControl({disabled: true}, Validators.required),
      });

    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    const fechaString = time.getFullYear() + '-' + mes.substring(mes.length, mes.length - 2)  +'-'+ dia.substring(dia.length, dia.length - 2);


    this.firestoreservice.getUf(fechaString).subscribe((ufSnap: any) => {
        ufSnap.forEach((uf: any) => {
          this.valorUf = parseFloat(uf.payload.doc.data().UF);
          this.uf_fecha = uf.payload.doc.data().FECHA;
        });
      });
    this.getBrands();
    // Instanciar usuario para usar api postgress..
    this.authService.isUserLoggedInAuth().pipe(
      tap((user)=>{if(user){this.user = user}})
    ).subscribe(
      // igual se puede validar que este el usuario aqui 
     _ => {
      let headers = this.headers = getHeaders(this.user);
       //Aqui consultas api ceo que deban ser ejecutadas al momento de crear el componente
     }
    );
  }


  get sinAForm() {
    return this.sinAutoForm.controls;
  }

  onSubmitRut() {
    const formData = this.searchForm.value;
    const rut = formData.rut;
    this.afiliado = null;
    this.isAfiliado = true;
    if (rut === '') {
      return;
    }
    this.getAfiliado_cla(rut, this.headers);
  }

  onSubmitSinAuto() {
    this.submitted = true;
    if (this.sinAutoForm.invalid) {
      return;
    }
    const payload = this.preparePayload(this.sinAutoForm.value);
    const user = this.authService.isUserLoggedIn();
    this.postgresService.getUsuarioPorMail(user.email.toUpperCase(), this.headers).subscribe(data=>{
      if(data){
        console.log(data);
        let temp = data[0];
        payload.nombre_colaborador = temp.nombres;
        payload.rut_colaborador = temp.rut;
        let mes = '0' + (payload.create_time.getMonth() + 1).toString();
        let dia = '0'+(payload.create_time.getMonth() +1 ).toString()
        const dataInsert = {
          rut: payload.rut_referido + '-' + payload.dv_referido,
          fecha: dia.substring(dia.length, dia.length - 2) + '-' + mes.substring(mes.length, mes.length - 2) + '-' + payload.create_time.getFullYear(),
          nombre: payload.nombre_referido  || '',
          telefono: payload.FONO_MOVIL + '' || '',
          modelo: payload.modelo_auto,
        };  
        this.firestoreservice.createReferidoAuto(payload).then(res => {
          this.apiCardifService.addDataCardif(dataInsert)
          Swal.fire({
            title: 'OK',
            text: 'Hemons Ingresado tu Referido',
            type: 'success'
          }).then(()=>{});
          this._router.navigate([`/referidos-auto-lista`]);

        }).catch(error => {
          throw new Error(error);
        });
       
      }

    }, error => {
      Swal.fire({
        title: 'Ups!',
        text: 'Algo salío mal.',
        type: 'warning'
      }).then(()=>{});
    })
  
  }


  preparePayload(payload) {
    
    const date = new Date();
    payload.create_time = date;
    payload.timeStamp = parseInt(date.getTime().toString().substring(0, 10));
    payload.rut_referido = parseInt(this.afiliado.id);
    payload.dv_referido = this.afiliado.data.dv_rut_persona;
    payload.nuevo = 1;
    payload.nombre_referido = this.afiliado.data.nombres;
    payload.fecha_nacimiento_persona = this.afiliado.data.fecha_nacimiento_persona;
    payload.predeterminado = 0;
    // STRING
    payload.patente = payload.patente.toUpperCase();
    payload.modelo_auto = payload.marca + '-' + payload.modelo_auto.toUpperCase();
    payload.correo_elect_persona = payload.correo_elect_persona.toLowerCase();
    return payload;
  }


  getAfiliado_cla(rut: any, headers) {
    this.afiliado = null;
    this.postgresService.getAfiliado(rut, headers).subscribe(
      (afiliadoDoc: any) => {
        if (afiliadoDoc.length < 1) {
          this.isAfiliado = false;
          this.ofertSeguroAuto = [];
          return;
        }
        this.afiliado = {
                id: afiliadoDoc[0].rut_persona,
                data: afiliadoDoc[0]
              };
        this.sinAutoForm.controls.nombre_referido.setValue(this.afiliado.data.nombres);
        this.sinAutoForm.controls.fecha_nacimiento_persona.setValue(this.afiliado.data.fecha_nacimiento_persona);
        this.sinAutoForm.controls.FONO_MOVIL.setValue(this.afiliado.data.fono_movil);
        this.sinAutoForm.controls.correo_elect_persona.setValue(this.afiliado.data.correo_elect_persona);
        this.contactForm = this.formBuilder.group({
                nombre_referido: new FormControl({value: this.afiliado.data.nombres, disabled: true}, Validators.required),
                fecha_nacimiento_persona: new FormControl({value: this.afiliado.data.fecha_nacimiento_persona}, Validators.required),
                FONO_MOVIL: this.afiliado.data.fono_movil,
                correo_elect: new FormControl(this.afiliado.data.correo_elect_persona,
                  [Validators.required, Validators.email]),
              });
        this.getCampanaSeguro(this.afiliado.id, headers);
      }
      );
  }

  getCampanaSeguro(rut, headers) {
    this.ofertSeguroAuto = [];
    this.postgresService.getAfiliadoAutoFull(rut, headers).subscribe((segAuto: any) => {
      segAuto.forEach((oferta: any) => {
        this.ofertSeguroAuto.push({
          data: oferta
        });
      });
  });
  }

  getBrands() {
    this.dummyMarcas = [];
    this.firestoreservice.getBrands().subscribe(
      (brands: any) => {
        brands.forEach((brand: any) => {
          this.dummyMarcas.push(brand.MARCA);
        });
      });
  }

  onMailStatusEmmiter(e) {
    this.isContactFormInValid = e;
  }
  onWrongMailFocus() {
    window.scrollTo(0, 0);
  }

}
