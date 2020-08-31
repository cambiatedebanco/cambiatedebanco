import { Component, OnInit } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { Subscription, Observable } from 'rxjs';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { DualListComponent } from 'angular-dual-listbox';
import Swal from 'sweetalert2';
import { getHeaderStts } from 'src/app/components/utility';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-socio',
  templateUrl: './create-socio.component.html',
  styleUrls: ['./create-socio.component.css']
})
export class CreateSocioComponent implements OnInit {
  private subscriptions = new Subscription();
  users:any[];
  selectedUser;
  enableSuc = [];
  source = [];
  confirmed = [];
  display: any;
  keepSorted = true;
  filter = true;
  public ID_CARGO_SOCIO = 1;
  public ID_DEFAULT_CARGO = 3;
  buscador;
  headers;
  format = {
    add: 'Agregar', remove: 'Remover', all: 'Todo', none: 'Nada',
    direction: DualListComponent.LTR, draggable: true, locale: 'es'
  };
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>;
  toModifyId = null;
  navigationSubscription: Subscription;
  private selectedResult = []

  constructor(private postgresService:PostgresService, private authService:AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    registerLocaleData( es );
    this.headers =   getHeaderStts(this.authService.isUserLoggedIn())
    this.postgresService.getUsuariosCla(this.headers).subscribe(data => {
      this.users = data;
    },
    error => {
      console.error(error)
    })
    this.filteredOptions = this.searchControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.toModifyId = this.route.snapshot.paramMap.get('id');
    if(this.toModifyId){
      this.getUusuarioPorRut(this.toModifyId);
    }
  }

  onEnterSearch(data){
    if(data.length  === 0){
      return
    }
    this.getUusuarioPorRut(data);
  }
  
  private getUusuarioPorRut(data: any) {
    this.subscriptions.add(this.postgresService.getUsuarioPorRut(data, this.headers)
      .subscribe(result => {
        if (result) {
          let temp = result[0];
          temp.rut = parseInt(temp.rut);
          this.selectedUser = temp;
          this.getSucursalesDisponibles();
          this.getSucursalesUsuario();
        }
      }, error => {
        console.error(error);
      }));
  }

  getSucursalesDisponibles(){
    this.subscriptions.add(this.postgresService.getSucursalesDisponibles(this.headers, 1, undefined).subscribe(data => {
      this.enableSuc = data;
      this.source = data
      this.getSucursalesUsuario();
    }, error => {
      console.error(error)
    }))
  }

  getSucursalesUsuario(){
    this.subscriptions.add(
      this.postgresService.getSucursalesDisponibles(this.headers,  undefined,this.selectedUser.rut).subscribe(
        data=> {
          console.log(data);
          this.confirmed = data;
          this.source = Array.from(new Set(this.source.concat(this.confirmed)));
          console.log(this.confirmed);
          console.log(this.source);
        }
      ))
  }
  turnIntoSocio(){
    this.selectedUser.id_cargo = this.selectedUser.id_cargo !== this.ID_CARGO_SOCIO ? this.ID_CARGO_SOCIO : this.ID_DEFAULT_CARGO
    let data = this.selectedUser;
    this.postgresService.updateRolUsuario(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido Actualizado',
        type: 'success'
      }).then(() => {
       
      });
    }, error => {
      console.error(error);
    })
  }


  submitSucursalUsuario(){

   // delete first 
   this.postgresService.deteleSucursalUsuario(this.selectedUser.rut, this.headers)
   .subscribe(_ => {
    if(typeof this.confirmed === 'undefined' || this.confirmed.length === 0){
      return;
    }
    console.log(this.confirmed);
    let data = new Array();

    this.confirmed.forEach(element => {
      data.push([this.selectedUser.rut, element.idsucursal, new Date()])
    });
    this.postgresService.addUsuarioSucursal(data, this.headers).subscribe(result=> {
    }, err => {
      console.error(err)
    })

    Swal.fire({
      title: 'OK',
      text: 'Sucursales del usuario actualizadas',
      type: 'success'
    }).then(() => {
     // ROUTER
    });
   },error => {
    console.error(error);
   })
  }

  private _filter(value: string): string[] {
    if(value.length >= 3){
    const filterValue = value.toLowerCase();
    if(this.users){
      return this.users.filter(option => option.rut.includes(filterValue))
    }
    }
    return []
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }


}
