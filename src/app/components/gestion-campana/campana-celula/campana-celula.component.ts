import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators, NgForm, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Subject, combineLatest, Subscription } from 'rxjs';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaders, getHeaderStts } from '../../utility';
import { tap } from 'rxjs/operators';
import { DualListComponent } from 'angular-dual-listbox';

@Component({
  selector: 'app-campana-celula',
  templateUrl: './campana-celula.component.html',
  styleUrls: ['./campana-celula.component.css']
})
export class CampanaCelulaComponent implements OnInit, OnDestroy {
  format = { add: 'Agregar', remove: 'Remover', all: 'Todo', none: 'Nada',
  direction: DualListComponent.LTR, draggable: true, locale: 'es' };
  navigationSubscription: Subscription;
  getUsuariosAllSubscribe: Subscription;
  getSupervisoresPorCampainSubscribe: Subscription;
  getColaboradoresByCampainSubscribe: Subscription;
  getCampainsByTipoSubscribe: Subscription;
  getCampanasByColaboradorSubscription: Subscription;
  getCampanasBySupervisorSubscription: Subscription;
  headers = null;
  dataUsers: any;
  dataCampains: any;
  sourceSupervisor: Array<any>;
  sourceCelula: Array<any>;
  confirmedSupervisor: Array<any>;
  confirmedCelula: Array<any>;
  keepSorted = true;
  key: string;
  display: any;
  filter = true;
  disabled = false;
  codigoCampaign;
  campanas: Array<any>;
  selectCampain = false;
  user: any;
  user_cla: any;
  campanasCol: any;
  constructor(private formBuilder: FormBuilder,
              public firestoreservice: FirestoreService,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private postgresService: PostgresService) { 

    }

  ngOnInit() {
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn());
    this.user = this.authService.isUserLoggedIn();

    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if (resp) {
          this.user_cla = resp[0];
          this.getUsuariosCla();
          if (Number(this.user_cla.id_cargo) === 6) {
            this.getCampainsByTipo();
          } else {
            this.getCampanasBySupervisor();
          }
        }
      });
  }


  getUsuariosCla(){
    this.getUsuariosAllSubscribe = this.postgresService.getUsuariosCla(this.headers).subscribe(
      data => {
        this.dataUsers = data;
        this.initDualListSupervisores();
        this.initDualListCelula();
      }
    )
  }

  getCampanasBySupervisor(){
    this.getCampanasBySupervisorSubscription = this.postgresService.getCampanasBySupervisor(parseInt(this.user_cla.rut), this.headers).subscribe((data: any) => {
      this.campanas = data;
    });
  }

  getCampainsByTipo(){
    this.getCampainsByTipoSubscribe = this.postgresService.getCampainsByTipo('CELULA', this.headers).subscribe(
      data => {
        this.campanas = data;
      }
    )
  }

  getSupervisoresPorCampain(id, headers) {
    this.getSupervisoresPorCampainSubscribe = this.postgresService.getSupervisoresPorCampain(id, headers).subscribe(
      data => {
        this.confirmedSupervisor = data;
      }
    )
  }

  getColaboradoresByCampain(idcampana, idsucursal, headers) {
    this.getColaboradoresByCampainSubscribe = this.postgresService.getColaboradoresByCampain('CELULA', idcampana, idsucursal, headers).subscribe(
      data => {
        this.confirmedCelula = data;
      }
    )
  }

  initDualListSupervisores() {
      const origen = this.dataUsers;
      this.sourceSupervisor = origen;
      this.display = this.ejecutivosLabel;
      this.key = 'rut';

  }

  initDualListCelula() {
      const origen = this.dataUsers;
      this.sourceCelula = origen;
      this.display = this.ejecutivosLabel;
      this.key = 'rut';

  }

  private ejecutivosLabel(item: any) {
    return item.rut + ' - ' + item.nombres + ' ' + item.apellido_paterno;
  }

  echoDestinationSupervisor(ejecutivosArray: any) {
    
    //this.deleteSupervisoresCampain(this.codigoCampaign, this.headers);
    this.postgresService.deleteSupervisoresCampain(this.codigoCampaign, this.headers).subscribe((_ => {
      let dataEjec: any;
      ejecutivosArray.forEach((data, index) => {
        dataEjec = {
          idusuario: data.rut,
          idcampana: this.codigoCampaign,
          created_time: new Date()
        };
        this.addSupervisoresCampain(dataEjec, this.headers);
      });
    }));
    

  }

  addSupervisoresCampain(data, headers){
    this.postgresService.addSupervisoresCampain(data, headers).subscribe(_=> {
    }, error => {
    });
  }

  /*deleteSupervisoresCampain(id, headers){
    this.postgresService.deleteSupervisoresCampain(id, headers).subscribe((_ => {
    }));

  }*/

  addColaboradoresCampain(data, headers){
    this.postgresService.addColaboradoresCampain(data, headers).subscribe(_=> {
    }, error => {
    });
  }

  addOrUpdatePrioridad(data, headers){
    this.postgresService.addOrUpdatePrioridad(data, headers).subscribe(_=> {
    }, error => {
    });
  }  
  /*deleteColaboradoresCampain(idcampana, idsucursal, headers){
    this.postgresService.deleteColaboradoresCampain(idcampana, idsucursal, headers).subscribe((_ => {
    }));

  }*/

  updateColaboradores(ejecutivosArray: any) {
    this.postgresService.deleteColaboradoresCampain(this.codigoCampaign, -1, this.headers).subscribe((_ => {
      const dataColaboradorCampain = new Array();

      ejecutivosArray.forEach((data, index) => {
        dataColaboradorCampain.push([data.rut, this.codigoCampaign, -1, index + 1, new Date()])

      });

      this.postgresService.addColaboradoresCampain(dataColaboradorCampain, this.headers).subscribe(_ => {

        const dataPriori = {
          idcampana: this.codigoCampaign,
          idsucursal: -1,
          prioridad: this.confirmedCelula.length,
          contador: 0,
          created_time: new Date()
        };

        this.postgresService.addOrUpdatePrioridad(dataPriori, this.headers).subscribe(_ => {
              }, error => {
        });  

      }, error => {

      });

    }));
  }

  echoDestinationCelula(ejecutivosArray: any) {
    this.postgresService.deleteColaboradoresCampain(this.codigoCampaign, -1, this.headers).subscribe((_ => {
      const dataColaboradorCampain = new Array();

      ejecutivosArray.forEach((data, index) => {
        dataColaboradorCampain.push([data.rut, this.codigoCampaign, -1, index + 1, new Date()])

      });

      this.postgresService.addColaboradoresCampain(dataColaboradorCampain, this.headers).subscribe(_ => {

        const dataPriori = {
          idcampana: this.codigoCampaign,
          idsucursal: -1,
          prioridad: this.confirmedCelula.length,
          contador: 0,
          created_time: new Date()
        };

        this.postgresService.addOrUpdatePrioridad(dataPriori, this.headers).subscribe(_ => {
              }, error => {
        });  

      }, error => {

      });

    }));
    
  }

  selectInputCampaign(campaignId: any) {
    this.selectCampain = true;
    this.codigoCampaign = campaignId;
    this.getSupervisoresPorCampain(campaignId, this.headers);
    this.getColaboradoresByCampain(campaignId, -1, this.headers);
  }

  ngOnDestroy(): void {
   if (this.getUsuariosAllSubscribe) {
     this.getUsuariosAllSubscribe.unsubscribe();
    }

   if (this.getColaboradoresByCampainSubscribe) {
      this.getColaboradoresByCampainSubscribe.unsubscribe();
     }

   if (this.getCampainsByTipoSubscribe) {
      this.getCampainsByTipoSubscribe.unsubscribe();
     }

   if (this.getCampanasByColaboradorSubscription) {
      this.getCampanasByColaboradorSubscription.unsubscribe();
     }

   if (this.getSupervisoresPorCampainSubscribe) {
      this.getSupervisoresPorCampainSubscribe.unsubscribe();
     }

  }


}
