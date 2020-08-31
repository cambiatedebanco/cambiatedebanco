import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { getHeaderStts } from 'src/app/components/utility';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import es from '@angular/common/locales/es';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { MatTreeNestedDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-create-agente',
  templateUrl: './create-agente.component.html',
  styleUrls: ['./create-agente.component.css']
})
export class CreateAgenteComponent implements OnInit {
  users: any[];
  selectedUser;
  enableSuc = [];
  source = [];
  confirmed = [];
  display: any;
  filter = true;
  public ID_CARGO_AGENTE = 2;
  public ID_DEFAULT_CARGO = 3;
  buscador;
  headers;
  keepSorted = true;
  format = {
    add: 'Agregar', remove: 'Remover', all: 'Todo', none: 'Nada',
    direction: DualListComponent.LTR, draggable: true, locale: 'es'
  };
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>;
  toModifyIdSucursal = null;
  navigationSubscription: Subscription;
  dotacionBase = []
  private ID_AGENTE = 2
  constructor(private authService: AuthService, private postgresService: PostgresService, private fireStoreService: FirestoreService, private route: ActivatedRoute,) { }

  ngOnInit() {
    registerLocaleData(es);
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn());
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
  this.fromCheckDotacion()
  }

  fromCheckDotacion()
  {
    this.toModifyIdSucursal = this.route.snapshot.paramMap.get('id');
    if(this.toModifyIdSucursal){
      this.postgresService.getUsuarioPorCargoSuc(this.ID_AGENTE, this.toModifyIdSucursal, this.headers).subscribe(
        _=>{
          if(_){
            this.selectedUser = _[0];
            this.getSucursal(this.selectedUser);
          }
        }
      )
    }
  }

  private _filter(value: string): string[] {
    if (value.length >= 3) {
      const filterValue = value.toLowerCase();
      if (this.users) {
        return this.users.filter(option => option.rut.includes(filterValue))
      }
    }
    return []
  }
  onEnterSearch(data) {
    if (data.length === 0) {
      return
    }
    this.getUusuarioPorRut(data);
  }


  getUusuarioPorRut(rut: any) {
    this.postgresService.getUsuarioPorRut(rut, this.headers).subscribe(result => {
      if (result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ) {
        let temp = result[0];
        this.selectedUser = temp;
        this.getSucursal(this.selectedUser);
        //

        //

      }
    })
  }
  
  sucursalUsuario = null
  getDotacion(user){
    let idsucursalUsuario = typeof this.toModifyIdSucursal === 'undefined'
    ? this.sucursalUsuario.idsucursal
    : this.toModifyIdSucursal
    this.postgresService.getDotacion(idsucursalUsuario, user.rut, this.headers)
      .subscribe(response => {
        this.source = response.disponibles
        this.dotacionBase = [...response.dotacion];
        this.source = Array.from(this.source.concat(response.dotacion))
        this.confirmed = response.dotacion
      }
      )
  }
 
  getSucursal(user){
    
    this.postgresService.getSucursalesDisponibles(this.headers, undefined, user.rut).subscribe(_ => {
      if(_){
        this.sucursalUsuario=_[0]
        this.getDotacion(user);
      }
    })
  }


  turnIntoAgente() {
    this.selectedUser.id_cargo = this.selectedUser.id_cargo != this.ID_CARGO_AGENTE
      ? this.ID_CARGO_AGENTE
      : this.ID_DEFAULT_CARGO
    let data = this.selectedUser;

    this.postgresService.updateRolUsuario(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido Actualizado',
        type: 'success'
      })
      this.getUusuarioPorRut(this.selectedUser.rut);
    }, error => {
      Swal.fire({
        title: 'Ups!',
        text: 'No se ha podido concretar la acción',
        type: 'error'
      })
    })
  }
  flagUpdate = false;

  submitDotacion(){
    // check dotación..
    this.authService.getestado();
    console.log(this.confirmed.length)
    this.flagUpdate = true;
    this.dotacionBase.forEach(element => {
      if(!this.confirmed.find(x => x.rut === element.rut)){
        console.log('SOMETHING WRONG CHECK')
        this.checkPendientes(element);
        this.getCreditosMiCarteraEstado(element);
      }
    });
    if(this.flagUpdate){
      let data = {
        id:this.sucursalUsuario.idsucursal,
        bulk:this.prepareUpdate(this.confirmed)
      }

      this.postgresService.updateUsuarioSucursal(data, this.headers).subscribe(_=>{
      Swal.fire({
        title: 'OK',
        text: 'Sucursales del usuario actualizadas',
        type: 'success'
      }).then(() => {
       
      });
    })}
    else{
      Swal.fire({
        title: 'Alerta',
        text: 'Confirme nuevamente',
        type: 'success'
      }).then(() => {
       
      });
    }
    // const found = arr1.some(r=> arr2.indexOf(r) >= 0)
  }


  
  checkPendientes(element){
    let filtro = 'nuevo'
    this.fireStoreService.getLeadsByEstado(element.rut, filtro).subscribe((snapShot:any) => {
      if(snapShot.length === 0){
        console.log('OK!')
      }
      if(snapShot.length > 0){
        this.flagUpdate = false;
        this.confirmed.push(element)
        Swal.fire({
          title: `No es posible remover a ${element.nombres} rut: ${element.rut}`,
          text: 'Porfavor reasignar leads ...',
          type: 'warning'
        }).then(function() {
         
      })
      }
    })   
  }

  getCreditosMiCarteraEstado(element){
    let estado = 1;

    this.postgresService.getCreditosMiCarteraEstado(element.rut, estado,this.headers).subscribe(data => {
      if(data.length === 0){
        return
      }else{
        this.confirmed.push(element)
        this.flagUpdate = false;
        Swal.fire({
          title: `No es posible remover a ${element.nombres} rut: ${element.rut}`,
          text: 'Porfavor reasignar leads ...',
          type: 'warning'
        }).then(function() {
      })
      }

    }, error => {
      console.error(error)
      return;
    })

  }

  prepareUpdate(confirmed){
    let data = []
    confirmed.forEach(element => {
      data.push([element.rut, this.sucursalUsuario.idsucursal, new Date()])
    });
    return data;
  }
}
