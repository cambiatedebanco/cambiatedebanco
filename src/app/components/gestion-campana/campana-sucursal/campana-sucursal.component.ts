import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Subscription, Observable } from 'rxjs';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaders } from '../../utility';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { DualListComponent } from 'angular-dual-listbox';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { getHeaderStts } from 'src/app/components/utility';

@Component({
  selector: 'app-campana-sucursal',
  templateUrl: './campana-sucursal.component.html',
  styleUrls: ['./campana-sucursal.component.css']
})
export class CampanaSucursalComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['idusuario', 'nombre', 'modifica'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  format = { add: 'Agregar', remove: 'Remover', all: 'Todo', none: 'Nada',
  direction: DualListComponent.LTR, draggable: true, locale: 'es' };
  private subscriptions = new Subscription();
  navigationSubscription: Subscription;
  getUsuariosAllSubscribe: Subscription;
  getColaboradoresByCampainSubscribe: Subscription;
  getCampainsByTipoSubscribe: Subscription;
  getColaboradoresBySucursalSubscribe: Subscription;
  headers = null;
  dataUsers: Array<any>;
  dataCampains: any;
  sourceCelula: Array<any>;
  confirmedCelula: Array<any>;
  confirmedInitial: Array<any>;
  confirmedEliminados: Array<any>;
  confirmedNuevos: Array<any>;
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  disabled = false;
  codigoCampaign;
  campanas: Array<any>;
  sucursales: Array<any>;
  selectCampain = false;
  selectSucursal = false;
  codigoSucursal;
  userPerfil = null;
  selectDisabled = false;
  colaboradoresDisp: Array<any>;
  nombreSucursal: string;
  idDocuemntsArray: Array<any>;
  confirmedResto: Array<any>;
  reasignaEjecutivo = false;
  user: any;
  user_cla: any;
  searchControl = new FormControl();
  filteredOptions: Observable<any[]>;
  constructor(private formBuilder: FormBuilder,
              public firestoreservice: FirestoreService,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private postgresService: PostgresService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
    }

  ngOnInit() {
  }

  initialiseInvites() {
    this.authService.getestado();
    this.userPerfil = this.authService.isUserLoggedInPerfil();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.user =this.authService.isUserLoggedIn();

    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];
          this.userPerfil = this.authService.isUserLoggedInPerfil();
          this.getCampainsByTipo(this.headers);
          this.getSucursalesByRutUsuario(this.userPerfil.rut, this.headers);
          this.getUsuarioPorRut(this.userPerfil.rut, this.headers);
        }
      });
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }



/**Información inicial**/
  getCampainsByTipo(headers) {
    this.getCampainsByTipoSubscribe = this.postgresService.getCampainsByTipo('SUCURSAL', headers).subscribe(
      data => {
        this.campanas = data;
      }
    );
  }

  getSucursalesByRutUsuario(headers, idusuario) {
    this.postgresService.getSucursalesByRutUsuario(headers,  idusuario).subscribe(
      data => {
        this.sucursales = data;

      }
    );
}

getUsuarioPorRut(rut, headers) {
  this.postgresService.getUsuarioPorRut(rut, headers)
    .subscribe(result => {
      this.userPerfil = result;
    }, error => {
      console.error(error);
    });
  }
/********************************/

selectInputCampaign(campaignId: any) {
  this.selectCampain = true;
  this.codigoCampaign = campaignId;

  if(parseInt(this.user_cla.id_cargo) === 2) {
    this.selectDisabled = true;
    this.selectInputSucursal(this.sucursales[0].idsucursal);
  }

  if (this.codigoSucursal) {
    this.getColaboradoresByCampain(this.codigoCampaign, this.codigoSucursal, this.headers);
    this.getColaboradoresBySucursal(this.codigoCampaign, this.codigoSucursal, this.headers);
  }

}

selectInputSucursal(idSuc: any) {
  this.selectSucursal = true;
  this.codigoSucursal = idSuc;
  const  array = Array.from(this.sucursales);
  const arrayFilter = array.filter(suc => suc.idsucursal === parseInt(this.codigoSucursal));
  this.nombreSucursal = arrayFilter[0].nombre_sucursal;
  this.getColaboradoresBySucursal(this.codigoCampaign, this.codigoSucursal, this.headers);
}

  

  initDualListCelula() {
      const origen = Array.from(this.dataUsers);
      this.sourceCelula = origen;
      this.display = this.ejecutivosLabel;
      this.key = 'rut';
  }

  initTableChangeUser(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = data;
  }

  private ejecutivosLabel(item: any) {
    return item.rut + ' - ' + item.nombres + ' ' + item.apellido_paterno;
  }

  addColaboradoresCampain(data, headers) {
    this.postgresService.addColaboradoresCampain(data, headers).subscribe(_ => {
    }, error => {
    });
  }

  addOrUpdatePrioridad(data, headers) {
    this.postgresService.addOrUpdatePrioridad(data, headers).subscribe(_ => {
    }, error => {
    });
  }

  echoDestinationCelula(ejecutivosArray: any) {
    this.confirmedNuevos = this.confirmedCelula.filter(f => !this.confirmedInitial.includes(f));
    this.confirmedEliminados = this.confirmedInitial.filter(f => !this.confirmedCelula.includes(f));
    this.confirmedResto = this.confirmedInitial.filter(f => !this.confirmedEliminados.includes(f));
  }

  submitColaboradoresCampana() {
    this.reasignaEjecutivo = false;

    const data = new Array();

    let arregloDataDistribuir = [];
    if (typeof this.confirmedEliminados !== 'undefined') {
      arregloDataDistribuir = (this.confirmedEliminados.length === 0  ? this.confirmedCelula : this.confirmedEliminados);
    } else {
       arregloDataDistribuir = this.confirmedCelula;
    }

    arregloDataDistribuir.forEach(element => {
      data.push(parseInt(element.rut));
    });
    const ejcutvosCampana = {
      campana: this.codigoCampaign,
      sucursal: this.codigoSucursal,
      data: data
    }

    this.postgresService.getLeadsByColaboradores(ejcutvosCampana, this.headers).subscribe(
        dataAfiliado => {
          if (dataAfiliado.length > 0) {
          this.updateBalanceoLeads(dataAfiliado);

        } else {
          this.postgresService.getLeadsBySucursal(this.nombreSucursal, this.codigoCampaign, this.headers).subscribe(
            dataAfiliadoSuc => {

              if (dataAfiliadoSuc.length > 0) {
                this.updateBalanceoLeads(dataAfiliadoSuc);
              } else {
                this.updateColaboradores();
              }

            });
        }
      }
      );


  }


updateBalanceoLeads(dataAfiliado) {
  
  let arregloReasigna = [];
  //Eliminados y Nuevos
  if (typeof this.confirmedEliminados !== 'undefined') {
    if (this.confirmedEliminados.length > 0 && this.confirmedNuevos.length > 0 ) {
      arregloReasigna = this.confirmedNuevos;
    }
    //solo eliminados
    if (this.confirmedEliminados.length > 0 && this.confirmedNuevos.length === 0 ) {
      arregloReasigna = this.confirmedCelula;
    }
    //solo nuevos
    if (this.confirmedEliminados.length === 0 && this.confirmedNuevos.length > 0 ) {
      arregloReasigna = this.confirmedCelula;
    }
} else {
  arregloReasigna = this.confirmedCelula;
}
  

  this.getSliceArray(dataAfiliado, arregloReasigna).forEach((dataAfiliado, index) => {
    const dataIds = new Array();
    dataAfiliado.forEach(element => {
      dataIds.push(element.id);
    });

    const dataUpdate = {
      idusuario: arregloReasigna[index].rut,
      emailusuario: arregloReasigna[index].email.toLowerCase(),
      idsucursal: this.codigoSucursal,
      idcampana: this.codigoCampaign,
      value: dataIds
    };
    this.postgresService.updateAsignLeads(dataUpdate, this.headers).subscribe(
      _ => {

      });
   });
  this.updateColaboradores();
}

getSliceArray(dataAfiliado, arregloReasigna) {

  const arregloDeArreglos = [];
  const LONGITUD_PEDAZOS = Math.round(dataAfiliado.length / arregloReasigna.length) < 1
  ? 1 : Math.round(dataAfiliado.length / arregloReasigna.length) + 1;

  for (let i = 0; i < dataAfiliado.length; i += LONGITUD_PEDAZOS) {
      const pedazo = dataAfiliado.slice(i, i + LONGITUD_PEDAZOS);
      arregloDeArreglos.push(pedazo);
  }

  return arregloDeArreglos;
}

  updateColaboradores() {
    this.postgresService.deleteColaboradoresCampain(this.codigoCampaign, this.codigoSucursal, this.headers).subscribe((_ => {
      const dataColaboradorCampain = new Array();

      this.confirmedCelula.forEach((data, index) => {
        dataColaboradorCampain.push([data.rut, this.codigoCampaign, this.codigoSucursal, index + 1, new Date()])

      });

      this.postgresService.addColaboradoresCampain(dataColaboradorCampain, this.headers).subscribe(_ => {

        const dataPriori = {
          idcampana: this.codigoCampaign,
          idsucursal: this.codigoSucursal,
          prioridad: this.confirmedCelula.length,
          contador: 0,
          created_time: new Date()
        };

        this.postgresService.addOrUpdatePrioridad(dataPriori, this.headers).subscribe(_ => {
          Swal.fire({
            title: 'OK',
            text: 'Colaboradores han sido Actualizados',
            type: 'success'
          }).then(() => {
            this.getColaboradoresBySucursal(this.codigoCampaign, this.codigoSucursal, this.headers);
          });
        }, error => {
        });  

      }, error => {

      });

    }));
  }





  getColaboradoresBySucursal(idcampana, idsucursal, headers) {
    this.dataUsers = [];
    this.getColaboradoresBySucursalSubscribe = this.postgresService.getColaboradoresBySucursal(idsucursal, headers).subscribe(
      async data => {
        this.dataUsers = data;
        this.confirmedCelula  = [];
        this.confirmedInitial = [];
        this.getColaboradoresByCampainSubscribe = this.postgresService.getColaboradoresByCampain('SUCURSAL', idcampana, idsucursal, headers).subscribe(
          data => {
            this.confirmedCelula = data;
            this.confirmedInitial = Array.from(this.confirmedCelula);
            this.filterColaboradoresDisponibles();
            this.initDualListCelula();
            this.initTableChangeUser(this.confirmedCelula);
          }
        );

      }
    );
  }

  getColaboradoresByCampain(idcampana, idsucursal, headers) {
    this.getColaboradoresByCampainSubscribe = this.postgresService.getColaboradoresByCampain('SUCURSAL', idcampana, idsucursal, headers).subscribe(
      data => {
        this.confirmedCelula = data;
        this.initTableChangeUser(this.confirmedCelula);
      }
    );
  }

  applyFilter(value: string) {
    let filterValue = value.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

    searchUser(value, f) {

    }

    filterColaboradoresDisponibles() {
      this.colaboradoresDisp = Array.from(this.dataUsers);

      this.confirmedCelula.forEach((source: any) => {
        const index: number = this.colaboradoresDisp.findIndex(element => element.rut === source.rut);
        this.colaboradoresDisp.splice(index, 1);
      });

    }

    onEnterSearch(value, origen) {
      let dato = value.split('-');
      const data = {
      idusuarioNew: Number(dato[0]),
      idusuario: Number(origen),
      idcampana: Number(this.codigoCampaign),
      idsucursal: Number(this.codigoSucursal),
      email: dato[1].toLowerCase()
    };

      this.postgresService.updateColaboradorCampain(data, this.headers).subscribe(_ => {
      Swal.fire({
        title: 'OK',
        text: 'Usuario ha sido Actualizado',
        type: 'success'
      }).then(() => {
        this.searchControl.setValue('');
      });
    }, error => {
      console.error(error);
    });
      this.getColaboradoresBySucursal(this.codigoCampaign, this.codigoSucursal, this.headers);

    }

    private _filter(value: string): string[] {
      if (value.length >= 2) {
        const filterValue = value.toLowerCase();
        if (this.colaboradoresDisp) {
          return this.colaboradoresDisp.filter(option => option.rut.includes(filterValue))
        }
      }
      return []
    }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
   }

    if (this.getUsuariosAllSubscribe) {
     this.getUsuariosAllSubscribe.unsubscribe();
    }

    if (this.getColaboradoresByCampainSubscribe) {
      this.getColaboradoresByCampainSubscribe.unsubscribe();
     }

    if (this.getCampainsByTipoSubscribe) {
      this.getCampainsByTipoSubscribe.unsubscribe();
     }

    if (this.getColaboradoresBySucursalSubscribe) {
      this.getColaboradoresBySucursalSubscribe.unsubscribe();
     }

  }


}
