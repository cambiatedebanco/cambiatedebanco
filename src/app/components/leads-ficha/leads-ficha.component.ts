import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDatepicker, MatNativeDateModule } from '@angular/material';
import Swal from 'sweetalert2';
import { Subscription, Subscribable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostgresService } from '../../services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-leads-ficha',
  templateUrl: './leads-ficha.component.html',
  styleUrls: ['./leads-ficha.component.css'],
  providers: [DatePipe]
})
export class LeadsFichaComponent implements AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['status', 'fecha', 'rut', 'nombre', 'variable', 'asignado', 'tool'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  filtroFechaForm;

  public notificaciones: any = [];
  campaigns: any = [];
  listIdCampaigns: any = [];
  isPensionado = false;
  user: any;
  rut: any;
  ejecutivos: any;
  nivel_acceso: any;
  quien: any;
  public leadsNuevos: number;
  public leadsPendientes: number;
  public leadsGestionados: number;
  public leadsPropensos: number;
  navigationSubscription: Subscription;
  data: any = [];
  usuariosClaSubscribe: Subscription;
  misejecutivosSubscribe: Subscription;
  campaingByEjecSubscribe: Subscription;
  leadsByArrayIdRutSubscribe: Subscription;
  campaingByEjecBannerSubscribe: Subscription;
  leadsByArrayIdRutBannerSubscribe: Subscription;
  campaingByEjecFilterSubscribe: Subscription;
  leadsArrayIdStateFilterSubscribe: Subscription;
  stateSubscription: Subscription;
  propenso = 0;
  states = [];
  headers = null;
  user_cla = null;
  userPerfil;
  constructor(
    public firestoreservice: FirestoreService,
    private route: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private postgresService: PostgresService) {
      this.navigationSubscription = this.route.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });

  }

  initialiseInvites() {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    this.filtroFechaForm = this.formBuilder.group(
        {
          startDate: new FormControl({value: date, disabled: true}, Validators.required),
          endDate: new FormControl({value: new Date(), disabled: true}, Validators.required)
        });

    this.auth.getestado();
    this.headers = getHeaderStts(this.auth.isUserLoggedIn())    
    this.user =this.auth.isUserLoggedIn();
        
    //this.desuscripcionAll();

    this.usuariosClaSubscribe = this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
          resp => {
            if(resp){
              this.user_cla=resp[0];
              this.userPerfil = this.auth.isUserLoggedInPerfil();
              this.rut = parseInt(this.user_cla.rut);
              this.nivel_acceso = parseInt(this.user_cla.nivel_acceso);
              
              this.initTable(parseInt(this.user_cla.rut));
              this.initBannerFilter(parseInt(this.user_cla.rut));
              if ( parseInt(this.nivel_acceso) === 4 ) {
                this.misejecutivosSubscribe = this.firestoreservice.getmisejecutivos(parseInt(this.user_cla.rut)).subscribe((ejecutivoSnapShot: any) => {
                  this.ejecutivos = [];
                  ejecutivoSnapShot.forEach((ejecutivo: any) => {
                    this.ejecutivos.push({
                      id: ejecutivo.payload.doc.id,
                      data: ejecutivo.payload.doc.data()
                    });
                });
              });
              }
            }
          });

    this.getStates();
   }


   onSubmit() {
    const formData = this.filtroFechaForm.value;

    const endDateFormat = new Date(formData.endDate.getFullYear(),
    formData.endDate.getMonth(),
    formData.endDate.getDate(), 0, 0, 0);

    const  startDateFormat = new Date(formData.startDate.getFullYear(),
    formData.startDate.getMonth(),
    formData.startDate.getDate(), 0, 0, 0);

    if (endDateFormat < startDateFormat) {
        this.filtroFechaForm.setErrors({notValid: true});
        return;
      } else {
        this.filtroFechaForm.setErrors({notValid: false});
      }

    if (this.filtroFechaForm.invalid) {
      return;
    }

    this.desuscripcionAll();
    this.initTable(parseInt(this.rut));
    this.initBannerFilter(parseInt(this.rut));

   }


  initTable(rut: any) {
    const formData = this.filtroFechaForm.value;

    this.notificaciones = [];
    this.campaigns = [];
    this.listIdCampaigns = [];
    this.data = [];
    this.campaingByEjecSubscribe = this.firestoreservice.getCampaingByEjec(rut).subscribe(
      (snapShot: any) => {
        this.listIdCampaigns = [];
        if (typeof snapShot !== 'undefined') {
          this.listIdCampaigns = snapShot.id_campaigns;
          this.isPensionado = this.listIdCampaigns.includes(1);

          if (parseInt(this.nivel_acceso) === 4 || parseInt(this.nivel_acceso) === 99) {
            this.leadsByArrayIdRutSubscribe = this.firestoreservice.getLeadsByArrayIdRut(this.listIdCampaigns, undefined, formData.startDate, formData.endDate).subscribe(
              dataSnap => {
                this.data = [];
                if (typeof dataSnap !== 'undefined') {
                  dataSnap.forEach((leads: any) => {
                      this.data.push(leads);
                  });
                  this.dataSource = new MatTableDataSource(this.data);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
            });
          } else {
            this.leadsByArrayIdRutSubscribe = this.firestoreservice.getLeadsByArrayIdRut(this.listIdCampaigns, this.rut, formData.startDate, formData.endDate).subscribe(
              dataSnap => {
                this.data = [];
                if (typeof dataSnap !== 'undefined') {
                  dataSnap.forEach((leads: any) => {
                    this.data.push(leads);
                  });
                  this.dataSource = new MatTableDataSource(this.data);
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
            });
          }
        }
      });
   }

   initBannerFilter(rut: any) {
    const formData = this.filtroFechaForm.value;
    this.campaingByEjecBannerSubscribe = this.firestoreservice.getCampaingByEjec(rut).subscribe(
      (snapShot: any) => {
        if (typeof snapShot !== 'undefined') {
        this.listIdCampaigns = snapShot.id_campaigns;
        if (parseInt(this.nivel_acceso) === 4 || parseInt(this.nivel_acceso) === 99) {
          this.leadsByArrayIdRutBannerSubscribe = this.firestoreservice.getLeadsByArrayIdRut(this.listIdCampaigns, undefined, formData.startDate, formData.endDate).subscribe(
            data => {
              this.leadsPendientes = 0;
              this.leadsGestionados = 0;
              this.leadsNuevos = 0;
              this.leadsPropensos = 0;
              if (typeof data !== 'undefined') {
                data.forEach((leads: any) => {
                  if (leads.nuevo === 1 && leads.gestionado === 0) {
                    this.leadsNuevos++;
                   } else if (leads.nuevo === 0 && leads.gestionado === 0) {
                    this.leadsPendientes++;
                   } else {
                    this.leadsGestionados++;
                   }

                  if (leads.star === 1) {
                     this.leadsPropensos++;
                   }

                });

            }
            });
        } else {
          this.leadsByArrayIdRutBannerSubscribe = this.firestoreservice.getLeadsByArrayIdRut(this.listIdCampaigns, this.rut, formData.startDate, formData.endDate).subscribe(
            data => {
              this.leadsPendientes = 0;
              this.leadsGestionados = 0;
              this.leadsNuevos = 0;
              this.leadsPropensos = 0;
              if (typeof data !== 'undefined') {
                data.forEach((leads: any) => {
                  if (leads.nuevo === 1 && leads.gestionado === 0) {
                    this.leadsNuevos++;
                   } else if (leads.nuevo === 0 && leads.gestionado === 0) {
                    this.leadsPendientes++;
                   } else {
                    this.leadsGestionados++;
                   }

                  if (leads.star === 1) {
                    this.leadsPropensos++;
                  }
                });

            }
          });
        }


  }
 });

   }

   ngAfterViewInit() {
  }


   onChange(event){
    let dato = event.split('-');
    let data = {
      rut_colaborador: Number(dato[1])
    };
    this.firestoreservice.updateLead(dato[0], data);
    Swal.fire({
      title: 'OK',
      text: 'Reasignado Correctamente',
      type: 'success'
    }).then(function() {

  });
   }

  onLead(id: any) {
    this.route.navigate(['lead', id] , {skipLocationChange: true});
   }

   filterLead(tipoFiltro: any) {

     if (this.campaingByEjecFilterSubscribe) {
      this.campaingByEjecFilterSubscribe.unsubscribe();
    }

     if (this.leadsArrayIdStateFilterSubscribe) {
      this.leadsArrayIdStateFilterSubscribe.unsubscribe();
    }

     if (this.campaingByEjecSubscribe) {
      this.campaingByEjecSubscribe.unsubscribe();
    }

     if (this.leadsByArrayIdRutSubscribe) {
      this.leadsByArrayIdRutSubscribe.unsubscribe();
    }
     const formData = this.filtroFechaForm.value;

     this.campaingByEjecFilterSubscribe = this.firestoreservice.getCampaingByEjec(this.rut).subscribe(
    (snapShot: any) => {
      this.data = [];
      this.listIdCampaigns = [];
      if (typeof snapShot !== 'undefined') {
      this.listIdCampaigns = snapShot.id_campaigns;
      this.leadsArrayIdStateFilterSubscribe = this.firestoreservice.getLeadsArrayIdState(this.listIdCampaigns, tipoFiltro, formData.startDate, formData.endDate).subscribe(
      dataSnap => {
        this.data = [];
        dataSnap.forEach((leads: any) => {
          if ((leads.tipo_campana === 1 || leads.tipo_campana === 2 || leads.tipo_campana === 3 || leads.tipo_campana === 4) && leads.rut_colaborador === this.rut && parseInt(this.nivel_acceso) !== 4) {
            this.data.push(leads);
          }
          if ((leads.tipo_campana === 1 || leads.tipo_campana === 2  || leads.tipo_campana === 3 || leads.tipo_campana === 4) && (parseInt(this.nivel_acceso) === 4 || parseInt(this.nivel_acceso) === 99)) {
            this.data.push(leads);
          }
          if (leads.tipo_campana !== 1 && leads.tipo_campana !== 2 && leads.tipo_campana !== 3 && leads.tipo_campana !== 4) {
            this.data.push(leads);
          }
        });

        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      });
    }
   });

   }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  applyFilterChange(value: any) {
    if(typeof value === 'undefined'){
      return;
    }
    
    this.dataSource.filter = value.trim();
  }

  desuscripcionAll() {
    if (this.usuariosClaSubscribe) {
      this.usuariosClaSubscribe.unsubscribe();
    }
    if (this.misejecutivosSubscribe) {
      this.misejecutivosSubscribe.unsubscribe();
    }
    if (this.campaingByEjecSubscribe) {
      this.campaingByEjecSubscribe.unsubscribe();
    }
    if (this.leadsByArrayIdRutSubscribe) {
      this.leadsByArrayIdRutSubscribe.unsubscribe();
    }
    if (this.campaingByEjecBannerSubscribe) {
      this.campaingByEjecBannerSubscribe.unsubscribe();
    }
    if (this.leadsByArrayIdRutBannerSubscribe) {
      this.leadsByArrayIdRutBannerSubscribe.unsubscribe();
    }
    if (this.campaingByEjecFilterSubscribe) {
      this.campaingByEjecFilterSubscribe.unsubscribe();
    }
    if (this.leadsArrayIdStateFilterSubscribe) {
      this.leadsArrayIdStateFilterSubscribe.unsubscribe();
    }
    if(this.stateSubscription){
      this.stateSubscription.unsubscribe();
    }
  }

  stateFilter(state){
    console.log(state);
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
    this.desuscripcionAll();
  }

  getStates(){
     this.stateSubscription = this.firestoreservice.getEstados().subscribe((estadosSnapShot: any) => {
      this.states = [];
      estadosSnapShot.forEach((estado: any) => {
        this.states.push({
          id: estado.payload.doc.id,
          data: estado.payload.doc.data()
        });
      });
    });
  }
}
