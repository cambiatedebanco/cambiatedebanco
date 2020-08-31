import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { PostgresService } from '../../services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

const datePipe = new DatePipe('es-Cl');
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements  OnInit, OnDestroy {
  @ViewChild('divRequiredSelect', {static: false}) divRequiredSelect: ElementRef;

public lead: any = [];
public estados: any = [];
public regiones: any = [];
public contexto: any = [];
navigationSubscription;
rut: any = [];
user: any;
public requiredOpcion: string;
nombreCampaign: any;
idCampaign: any;
isMonto: boolean;
userPerfil = null;
user_cla = null;
headers = null;
constructor(
  private formBuilder: FormBuilder,
  public _firestoreservice: FirestoreService,
  private _route: Router,
  private route: ActivatedRoute,
  private authService: AuthService,
  private postgresService: PostgresService) {
  this.navigationSubscription = this._route.events.subscribe((e: any) => {
    // If it is a NavigationEnd event re-initalise the component
    if (e instanceof NavigationEnd) {
      this.initialiseInvites();
    }
  });
 }

initialiseInvites() {

    const id = this.route.snapshot.params.id;
    const data = {
      nuevo : 0
    };

    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.user =this.authService.isUserLoggedIn();

    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
          resp => {
            if(resp){
              this.user_cla=resp[0];
              this.userPerfil = this.authService.isUserLoggedInPerfil();
              this.rut = this.userPerfil.rut;

              if (this.rut = this.userPerfil.nivel_acceso === 3){
                this._firestoreservice.updateLeadNuevo(id, data);
              }
            }
          });


    this._firestoreservice.updateLeadNuevo(id, data);

    if (id !== 'nuevo') {
      this._firestoreservice.getEstados().subscribe((estadosSnapShot: any) => {
        this.estados = [];
        estadosSnapShot.forEach((estado: any) => {
          this.estados.push({
            id: estado.payload.doc.id,
            data: estado.payload.doc.data()
          });
        });
      });

      this._firestoreservice.getRegiones().subscribe((estadosSnapShot: any) => {
        this.regiones = [];
        estadosSnapShot.forEach((estado: any) => {
          this.regiones.push({
            id: estado.payload.doc.id,
            data: estado.payload.doc.data()
          });
        });
      });


      const lead1 = [];
      this._firestoreservice.getLead(id).subscribe((resp: any) => {

         lead1.push({
          id: id,
          fecha: resp.payload.data().fecha,
          rut: resp.payload.data().rut,
          nombre: resp.payload.data().nombre,
          phone_number: resp.payload.data().phone_number,
          comuna: resp.payload.data().comuna,
          email: resp.payload.data().email,
          id_estado: resp.payload.data().id_estado,
          observaciones: resp.payload.data().observaciones,
          form_id: resp.payload.data().form_id,
          created_time: datePipe.transform(resp.payload.data().created_time.toDate().toString(), 'short'),
          id_solicitud:  resp.payload.data().id,
          timestamp:  resp.payload.data().timestamp,
          ruta: resp.payload.data().ruta,
          monto_cursado: resp.payload.data().monto_cursado,
          id_region: resp.payload.data().id_region || '0'

        });
         if (resp.payload.data().monto_cursado > 0) {
            this.isMonto = true;
        }
         this._firestoreservice.getCampaign(resp.payload.data().tipo_campana + '').subscribe(
          (dataCampaign: any) => {
           this.nombreCampaign = dataCampaign.nombre_campaign;
           this.idCampaign = dataCampaign.id_campaign;
          });

         this.lead = lead1[0];

         if (typeof this.lead.form_id === 'undefined') {
          return;
        }

         this._firestoreservice.getContexto(this.lead.form_id).subscribe((estadosSnapShot: any) => {
          this.contexto = [];
          estadosSnapShot.forEach((ctx: any) => {
            this.contexto.push({
              id: ctx.payload.doc.id,
              data: ctx.payload.doc.data()
            });
          });
        });
        });
    }
  }


public guardar(form: NgForm) {

  Swal.fire({
    title: 'Espera',
    text: 'Actualizando Información',
    type: 'info',
    allowOutsideClick: false
    });
  Swal.showLoading();
  const date = new Date();
  let monto = 0;
  let re = /\./gi;
  let re2 = /\,/gi;
  let re3 = /\-/gi;

  if (form.controls.monto_cursado){

    monto = form.controls.monto_cursado.value == undefined ? 0 : (isNaN(parseInt(String(form.controls.monto_cursado.value).replace(re, '').replace(re2, '').replace(re3, ''))) ? 1 : parseInt(String(form.controls.monto_cursado.value).replace(re, '').replace(re2, '').replace(re3, '')));
  }


  if (form.controls.id.value !== '') {

      const data = {
      id_estado : form.controls.id_estado.value,
      email : form.controls.email.value || '',
      nombre : form.controls.nombre.value || '',
      phone_number : form.controls.phone_number.value || '',
      rut : form.controls.rut.value || '',
      observaciones: form.controls.observaciones.value || '',
      nuevo: 0,
      gestionado: (form.controls.id_estado.value === '1' ? 0 : 1),
      rut_colaborador: parseInt(this.userPerfil.rut) || '',
      comuna: form.controls.comuna.value || '',
      email_colaborador: this.userPerfil.email.toLowerCase() || '',
      fecha_gestion: date,
      monto_cursado: monto,
      id_region: form.controls.id_region.value
    };

      this._firestoreservice.updateLead(form.controls.id.value, data);
      Swal.fire({
      title: 'OK',
      text: 'Se Actualiza correctamente',
      type: 'success'
    }).then( function() {

    });

  }



}

onChange(deviceValue) {
    this.divRequiredSelect.nativeElement.style.display = 'none';
}

ngOnInit() {
}
ngOnDestroy(): void {
  // avoid memory leaks here by cleaning up after ourselves. If we
  // don't then we will continue to run our initialiseInvites()
  // method on every navigationEnd event.
  if (this.navigationSubscription) {
     this.navigationSubscription.unsubscribe();
  }
}
selectInput(e){
  let selected = e.target.value;
  if (selected == 5 || selected == 12) {
    this.isMonto = true;
  } else {
    this.isMonto = false;
  }

}

}
