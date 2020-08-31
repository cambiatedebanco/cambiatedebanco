import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { getHeaderStts } from '../../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('es-Cl');

@Component({
  selector: 'app-form-lead',
  templateUrl: './form-lead.component.html',
  styleUrls: ['./form-lead.component.css']
})
export class FormLeadComponent implements OnInit, OnDestroy {
  @ViewChild(NavbarComponent, {static: false}) navbar:NavbarComponent;
  formGroup: FormGroup;
  headers = null;
  user = null;
  user_cla = null;
  getLeadByIdSubscription: Subscription;
  getEstadosLeadsSubscription: Subscription;
  getRegionesSubscription: Subscription;
  lead = null;
  estados: any;
  regiones: any;
  isMonto: boolean;
  selectedEstado = null;
  estadoSubscription: Subscription;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
                 private postgresqlService: PostgresService,
                 private _route: Router,
                 private route: ActivatedRoute) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    const id = this.route.snapshot.paramMap.get('id');
    this.formGroup = this.formBuilder.group({
      id: new FormControl({value: '', disabled: true},  [Validators.required]),
      created_time: new FormControl({value: '', disabled: true}, [Validators.required]),
      rut: new FormControl('', [Validators.required]),
      nombre: new FormControl({value: ''}),
      comuna: new FormControl({value: ''}),
      id_region: new FormControl(null),
      phone_number: new FormControl(),
      email: new FormControl({value: ''}),
      id_estado: new FormControl(null),
      monto_cursado: new FormControl({value: 0}),
      observaciones: new FormControl({value: ''})
    });
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
    //this.user.email
    this.postgresqlService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla = resp[0];
          this.getEstadosLeads(this.headers);
          this.getRegiones(this.headers);
          this.getLeadById(id, this.headers);
          if(Number(this.user_cla.id_cargo) !== 4){
            this.updatePendienteLead({fecha_gestion: new Date(), id: parseInt(id)});
          }
          this.navbar.getTop11LeadsColaborador();
        }
      });
  }

  private getLeadById(id: string, headers) {
    this.getLeadByIdSubscription = this.postgresqlService.getLeadById(id, headers).subscribe((snap: any) => {
      this.lead = snap[0];
      this.initForm(this.lead);
    })
  }

  updatePendienteLead(data){
    this.postgresqlService.updatePendienteLead(data, this.headers).subscribe(res=> res ,
    err => {
      console.error(err)
    },
    ()=> {
    }
  )
  }

  initForm(lead){
    this.formGroup.controls.id.setValue(lead.id);
    this.formGroup.controls.created_time.setValue(datePipe.transform(lead.created_time.toString(), 'short'));
    this.formGroup.controls.rut.setValue(lead.rut);
    this.formGroup.controls.nombre.setValue(lead.nombre);
    this.formGroup.controls.comuna.setValue(lead.comuna);
    this.formGroup.controls.id_region.setValue(parseInt(lead.id_region || 0));
    this.formGroup.controls.phone_number.setValue(lead.phone_number);
    this.formGroup.controls.email.setValue(lead.email);
    this.formGroup.controls.id_estado.setValue(parseInt(lead.id_estado));
    this.formGroup.controls.monto_cursado.setValue(parseInt(lead.monto_cursado || 0));
    this.formGroup.controls.observaciones.setValue(lead.observaciones);
    if (parseInt(lead.monto_cursado) > 0) {
      this.isMonto = true;
    }
    this.estadoSubscription = this.formGroup.get('id_estado').valueChanges.subscribe(value=> {
      if (parseInt(value) === 5 || parseInt(value) === 12) {
        this.isMonto = true;
      } else {
        this.isMonto = false;
      }
    });

}

getEstadosLeads(headers: any) {
  this.getEstadosLeadsSubscription = this.postgresqlService.getEstadosLeads(headers).subscribe((estados: any) => {
    this.estados = estados;
  });

}

getRegiones(headers: any) {
  this.getRegionesSubscription = this.postgresqlService.getRegiones(headers).subscribe((regiones: any) => {
    this.regiones = regiones;
  });

}

public onSubmit() {
  const formData = this.formGroup.value;
  if (parseInt(formData.id_estado) === 0) {
    return;
  }
  /*Swal.fire({
    title: 'Espera',
    text: 'Actualizando Información',
    type: 'info',
    allowOutsideClick: false
    });
  Swal.showLoading();*/

  let monto = 0;
  let re = /\./gi;
  let re2 = /\,/gi;
  let re3 = /\-/gi;

  if (formData.monto_cursado){

    monto = formData.monto_cursado == undefined ? 0 : (isNaN(parseInt(String(formData.monto_cursado).replace(re, '').replace(re2, '').replace(re3, ''))) ? 1 : parseInt(String(formData.monto_cursado).replace(re, '').replace(re2, '').replace(re3, '')));
  }


  if (formData.id_estado !== '') {

      const data = {
      id: parseInt(this.lead.id),
      id_estado : parseInt(formData.id_estado),
      email : formData.email || '',
      nombre : formData.nombre || '',
      phone_number : formData.phone_number || '',
      rut : formData.rut || '',
      observaciones: formData.observaciones || '',
      nuevo: 0,
      gestionado: (formData.id_estado === '1' ? 0 : 1),
      rut_colaborador: parseInt(this.user_cla.rut) || '',
      comuna: formData.comuna || '',
      email_colaborador: this.user_cla.email.toLowerCase() || '',
      fecha_gestion: new Date(),
      monto_cursado: monto || 0,
      id_region: formData.id_region
    };
    this.updateLead(data);

      Swal.fire({
      title: 'OK',
      text: 'Se Actualiza correctamente',
      type: 'success'
    }).then( function() {

    });

  }



}

updateLead(data){
  this.postgresqlService.updateLead(data, this.headers).subscribe(res=> res ,
  err => {
    console.error(err)
  },
  ()=> {
  }
)
}

onIdEmmiter(id){
  this.getLeadById(id, this.headers);
  if(Number(this.user_cla.id_cargo) !== 4){
    this.updatePendienteLead({fecha_gestion: new Date(), id: parseInt(id)});
  }
  this.navbar.getTop11LeadsColaborador();

}

ngOnDestroy(): void {
  if (this.getEstadosLeadsSubscription ) {
      this.getEstadosLeadsSubscription.unsubscribe();
  }
  if (this.getRegionesSubscription ) {
    this.getRegionesSubscription.unsubscribe();
  }
  if (this.getEstadosLeadsSubscription ) {
    this.getEstadosLeadsSubscription.unsubscribe();
  }
  
  if (this.estadoSubscription ) {
    this.estadoSubscription.unsubscribe();
  }
  
  if (this.getLeadByIdSubscription) {
    this.getLeadByIdSubscription.unsubscribe();
  }

}

}
