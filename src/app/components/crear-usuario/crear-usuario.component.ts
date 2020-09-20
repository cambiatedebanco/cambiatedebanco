import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { RutValidator } from '../../rut.validator';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

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
  subsBanco: Subscription;
  subsUserMail: Subscription;
  subsAddUser: Subscription;
  subsRoles: Subscription;
  rolesDisponibles
  bancos: any = [];
  user_cla = null;
  constructor(
    private formBuilder: FormBuilder,
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
      { acceso: 1, name: 'Mi Cartera' },
      { acceso: 99, name: 'Administración' }
    ];
  }

  toggleCaja(){

      this.agregarForm.setControl('email', new FormControl('' ,[Validators.required, Validators.email]))

    
  }

  initializeHeader() {
    this.user_cla = JSON.parse(localStorage.getItem('user_perfil'));
    this.user = this.authService.isUserLoggedIn();
    this.headers = getHeaderStts(this.user);
    this.rutEjec = this.user_cla.rut;
    this.getRolesDisponibles();
    this.getBancos();
  }

  getBancos(){
    this.subsBanco = this.postgresService.getBancos().subscribe(resp=>{
      this.bancos=resp;
    })
  }
  

  public onSubmit() {
    this.submitted = true;

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
    this.subsAddUser = this.postgresService.addUser(data, this.headers).subscribe(_ => {
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
    this.subsRoles = this.postgresService.getRoles(this.headers).subscribe(result => {
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
    if (this.subsBanco) {
      this.subsBanco.unsubscribe();
    }
    if (this.subsUserMail) {
      this.subsUserMail.unsubscribe();
    }
    if (this.subsAddUser) {
      this.subsAddUser.unsubscribe();
    }

    if (this.subsRoles) {
      this.subsRoles.unsubscribe();
    }

  }
}
