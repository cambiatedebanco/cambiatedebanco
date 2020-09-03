import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { RutValidator } from '../../rut.validator';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { tap } from 'rxjs/operators';
import { getHeaders } from '../utility';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {
  @ViewChild('displayForm', { static: false }) displayForm: ElementRef;
  agregarForm;
  submitted = false;
  Ischecked: boolean;
  allemps: any;
  startAt = new Subject();
  endAt = new Subject();
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  emps: any;
  nivelAcceso: any;
  selected: any;
  navigationSubscription;
  searchForm;
  userExist = false;
  lengthRut = false;
  rutUserExist: any;
  sucursales: any = [];
  user: any;
  rutEjec: any;
  headers = null;
  subscriptionPostgres: Subscription;
  rolesDisponibles
  DEFAULTDOMAIN: String = '@CAJALOSANDES.CL'
  EXTERNALDOMAIN: String = ''
  bancos: any = [];
  constructor(
    private formBuilder: FormBuilder,
    public firestoreservice: FirestoreService,
    public authService: AuthService,
    private router: Router,
    private postgresService: PostgresService,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.initializeHeader();

    this.searchForm = this.formBuilder.group(
      {
        rut: new FormControl('', [Validators.required, RutValidator.validaRut]),
      });
    this.agregarForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required]),
        nombres: new FormControl('', [Validators.required]),
        apellido_paterno: new FormControl('', [Validators.required]),
        apellido_materno: new FormControl('', [Validators.required]),
        nivel_acceso: new FormControl(''),
        cargo: new FormControl('null' , [Validators.required]),
        banco: new FormControl('null' , [Validators.required])
      });



    this.nivelAcceso = [
      { acceso: 1, name: 'Afiliado y Empresa' },
      { acceso: 2, name: 'Empresa' },
      { acceso: 3, name: 'Afiliado' },
    ];
  }

  toggleCaja(){

      this.agregarForm.setControl('email', new FormControl('' ,[Validators.required, Validators.email]))

    
  }

  initializeHeader() {
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => {
        if (user) {
          this.user = user;
          this.headers = getHeaders(user)

          this.postgresService.getUsuarioPorMail(this.user.email.toUpperCase(), this.headers).subscribe(resp => {
            if (resp) {
              this.rutEjec = resp[0].rut
            }
          })

        }
      })
    ).subscribe(
      _ => {
        this.getRolesDisponibles()
        this.getBancos()
      }
    ), error => {
      console.error(error)
    }
  }

  getBancos(){
    this.postgresService.getBancos().subscribe(resp=>{
      this.bancos=resp;
      console.log(this.bancos);
    })
  }
  

  public onSubmit() {
    this.submitted = true;
    console.log(this.agregarForm.value)

if(this.agregarForm.invalid){
return;
}

    const formData = this.agregarForm.value;

    let rut = this.searchForm.value.rut;
    let dv = rut.substring(rut.length - 1, rut.length);
    rut = String(rut).replace('.', '').substring(0, String(rut).replace('.', '').length - 2);
    const date = new Date();


    const data = {
      rut: parseInt(rut),
      email: formData.email.toUpperCase().trim(),
      nombres: formData.nombres.toUpperCase().trim(),
      apellido_paterno: formData.apellido_paterno.toUpperCase().trim(),
      apellido_materno: formData.apellido_materno.toUpperCase().trim(),
      puesto_real: 'EJECUTIVO',
      es_ejecutivo: 1,
      sucursal: 'NA',
      nivel_acceso: parseInt(formData.nivel_acceso),
      marca_vigencia: 'S',
      dv: dv,
      fecha_actualizacion: date,
      usuario_actualiza: this.rutEjec,
      id_cargo: formData.cargo === 'null' ? null : formData.cargo,
      es_caja: 1 ,
      idbanco: formData.banco
    };
    this.addUserPostgres(data);

  }


  addUserPostgres(data) {
    this.postgresService.addUser(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido Ingresado',
        type: 'success'
      }).then(() => {
        this.router.navigate([`/admin-roles`]);
      })
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'No ha sido posible ingresar al usuario',
        type: 'error'
      }).then(() => { });
    })
  }




  modelChange($event) {
  }

  onEnter($event) {
    let q = $event.source.value;
  }

  search($event) {
    let q = $event.target.value;

    if (q !== '') {
      this.startAt.next(q.toUpperCase());
      this.endAt.next(q.toUpperCase() + '\uf8ff');
    } else {
      this.emps = this.allemps;
    }
  }

  onSubmitRut() {
    this.userExist = false;
    if (this.searchForm.invalid) {
      return;
    }
    const formData = this.searchForm.value;

    let rut = formData.rut;
    this.lengthRut = (rut.length > 6 ? true : false);
    rut = String(rut).replace('.', '').substring(0, String(rut).replace('.', '').length - 2);
    this.subscriptionPostgres = this.postgresService.getUsuarioPorRut(rut, this.headers).subscribe(res => {
      if (res.length > 0) {
        this.rutUserExist = rut;
        this.userExist = true;
        return;
      }
      this.prepareForm()
    }
    )

  }

  prepareForm() {
    this.agregarForm.reset();
  }

  getRolesDisponibles() {
    this.postgresService.getRoles(this.headers).subscribe(result => {
      this.rolesDisponibles = result
    })
  }

  keyPress(event: any) {
    this.userExist = false;
    this.lengthRut = false;
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
    if (this.subscriptionPostgres) {
      this.subscriptionPostgres.unsubscribe();
    }
  }
}
