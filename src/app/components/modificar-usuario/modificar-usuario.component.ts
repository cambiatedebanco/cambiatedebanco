import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaders } from '../utility';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit, OnDestroy {
  modificarForm;
  submitted = false;
  usuario: any = [{ apellido_paterno: ' ' }];
  Ischecked: boolean;
  allemps: any;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  emps: any;
  nivelAcceso: any;
  selected: any;
  selectedBanco: any;
  navigationSubscription;
  user: any;
  campaignsEjecutivo: any = [];
  control: any = [];
  checked: boolean;
  rutEjec: any;
  rutUsuario: any;
  subscriptionGetUserCla: Subscription;
  headers = null;
  currentUser = null
  isFormReady:boolean = false;
  toUpdateId = null;
  bancos: any = [];
  constructor(
    private formBuilder: FormBuilder,
    public firestoreservice: FirestoreService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private postgresService: PostgresService
  ) {

  }


  initialiseInvites() {
    this.toUpdateId = this.route.snapshot.paramMap.get('id');
    this.authService.isUserLoggedInAuth().pipe(
        tap((user) => { if (user) { 
          this.currentUser = user;
        this.headers = getHeaders(this.currentUser)
        this.postgresService.getUsuarioPorMail(user.email, this.headers).subscribe(data=> {
          if(data.length> 0){
            this.rutUsuario = data[0].rut
          }
        })
         } })
      ).subscribe(
        _ => {

         this.getUsuarioPostgres(this.toUpdateId);
         this.getRolesDisponibles();
         this.getBancos()
        }
      )

      this.nivelAcceso = [
        { acceso: 1, name: 'Mi Cartera' },
        { acceso: 99, name: 'Administración' }
      ];

  }
  rolesDisponibles = []
  getRolesDisponibles(){
    this.postgresService.getRoles(this.headers).subscribe(result=>{
      console.log(result);
      this.rolesDisponibles = result
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.modificarForm.invalid) {
      return;
    }
    const date = new Date();
    this.user = this.authService.isUserLoggedIn();
    const formData = this.modificarForm.value;

    const data = {
      rut: this.toUpdateId,
      email: formData.email,
      nombres: formData.nombres.trim(),
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      puesto_real: 'EJECUTIVO',
      es_ejecutivo: 1,
      sucursal: 'NA',
      nivel_acceso: parseInt(formData.nivel_acceso),
      marca_vigencia: 'S',
      fecha_actualizacion: date,
      usuario_actualiza: this.rutUsuario,
      id_cargo : formData.cargo === 'null' ? null: formData.cargo,
      idbanco: formData.banco
    };

    this.updateUsuarioPostgres(data)

  }
  getBancos(){
    this.postgresService.getBancos().subscribe(resp=>{
      this.bancos=resp;
    })
  }
  getUsuarioPostgres(id: any) {
    this.postgresService.getUsuarioPorRut(id, this.headers).subscribe(res => {
      if (res.length > 0) {
        this.updateControls(res[0]);

      }
    },
      error => {
        console.error('Algo salio mal al buscar al usuario')
        Swal.fire({
          title: 'Error',
          text: 'Algo salío mal',
          type: 'error'
        }).then(() => { });
      })

  }
  updateUsuarioPostgres(data: any) {
    this.postgresService.updateUsuario(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido actualizado',
        type: 'success'
      }).then(() => {
         this.router.navigate([`/admin-roles`]);
        });

    },
      err => {
        Swal.fire({
          title: 'Ups!',
          text: 'Algo salío mal',
          type: 'error'
        }).then(() => { });
        console.error(err)
      })
  }

  updateControls(data) {
    console.log(data)
    let cargo = data.id_cargo ? parseInt(data.id_cargo) : ''
    console.log(cargo);
    this.modificarForm = this.formBuilder.group(
      {
        rut: new FormControl({value: data.rut, disabled: true},),
        email: new FormControl(data.email, [Validators.email, Validators.required]),
        nombres: new FormControl(data.nombres, [Validators.required]),
        apellido_paterno: new FormControl(data.apellido_paterno, [Validators.required]),
        apellido_materno: new FormControl(data.apellido_materno, [Validators.required]),
        nivel_acceso: new FormControl(data.nivel_acceso, [Validators.required]),
        cargo:new FormControl(cargo),
        banco: new FormControl(data.idbanco, [Validators.required])
      });
    this.Ischecked = data.es_ejecutivo === 1;
    this.selected = data.nivel_acceso;
    this.selectedBanco = data.idbanco;
    this.rutEjec = data.rut;
    this.isFormReady = true;
  }



  get modForm() {
    return this.modificarForm.controls;
  }

  modelChange($event) {

  }

  onEnter($event) {
    const q = $event.source.value;
  }

  search($event) {
    const q = $event.target.value;

    if (q !== '') {
      this.startAt.next(q.toUpperCase());
      this.endAt.next(q.toUpperCase() + '\uf8ff');
    } else {
      this.emps = this.allemps;
    }
  }

  ngOnInit() {
    this.initialiseInvites();
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}


