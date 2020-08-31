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
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9\._]+')]),
        nombres: new FormControl('', [Validators.required]),
        apellido_paterno: new FormControl('', [Validators.required]),
        apellido_materno: new FormControl('', [Validators.required]),
        puesto_real: new FormControl('', [Validators.required]),
        es_ejec: new FormControl(''),
        sucursal: ['', Validators.required],
        nivel_acceso: new FormControl(''),
        cargo: new FormControl('null' , [Validators.required]),
        es_caja: new FormControl({ value: true })
      });




    combineLatest(this.startobs, this.endobs).subscribe((value: any) => {
      if(value[0].length === 0){
        return;
      }
      this.postgresService.getSucursalLike(value[0], this.headers).subscribe(resp => {
        this.allemps = resp;
      }, error => {
        console.error(error)})

    });

    this.nivelAcceso = [
      { acceso: 1, name: 'Afiliado y Empresa' },
      { acceso: 2, name: 'Empresa' },
      { acceso: 3, name: 'Afiliado' },
    ];
  }

  toggleCaja(){
    let es_caja = this.agregarForm.value.es_caja;
    if(!es_caja){
      this.agregarForm.setControl('email', new FormControl('',[Validators.required, Validators.pattern('^[a-z0-9\._]+')]))
    }
    else{
      this.agregarForm.setControl('email', new FormControl('' ,[Validators.required, Validators.email]))
    }
    
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
      }
    ), error => {
      console.error(error)
    }
  }


  public onSubmit() {
    this.submitted = true;

    let dataCheck: any = [];
    dataCheck = {
    };

    if (this.agregarForm.invalid) {
      return;
    }

    const formData = this.agregarForm.value;

    let rut = this.searchForm.value.rut;
    let dv = rut.substring(rut.length - 1, rut.length);
    rut = String(rut).replace('.', '').substring(0, String(rut).replace('.', '').length - 2);
    const date = new Date();
    const domain = formData.es_caja ? this.DEFAULTDOMAIN : this.EXTERNALDOMAIN
    const data = {
      rut: parseInt(rut),
      email: formData.email.toUpperCase().trim() + domain,
      nombres: formData.nombres.toUpperCase().trim(),
      apellido_paterno: formData.apellido_paterno.toUpperCase().trim(),
      apellido_materno: formData.apellido_materno.toUpperCase().trim(),
      puesto_real: formData.puesto_real.toUpperCase().trim(),
      es_ejecutivo: (formData.es_ejec ? 1 : 0),
      sucursal: formData.sucursal.toUpperCase().trim(),
      nivel_acceso: parseInt(formData.nivel_acceso),
      marca_vigencia: 'S',
      dv: dv,
      fecha_actualizacion: date,
      usuario_actualiza: this.rutEjec,
      id_cargo: formData.cargo === 'null' ? null : formData.cargo,
      es_caja: formData.es_caja 
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
    this.agregarForm.controls['es_caja'].setValue(true)
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
