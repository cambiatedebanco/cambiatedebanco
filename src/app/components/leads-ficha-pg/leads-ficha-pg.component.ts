import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatSort, MatPaginator, MatDatepicker, MatNativeDateModule } from '@angular/material';
import Swal from 'sweetalert2';
import { Subscription, Subscribable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PostgresService } from '../../services/postgres/postgres.service';
import { getHeaderStts } from '../utility';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-leads-ficha-pg',
  templateUrl: './leads-ficha-pg.component.html',
  styleUrls: ['./leads-ficha-pg.component.css']
})
export class LeadsFichaPgComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['status', 'fecha', 'rut', 'nombre', 'campana', 'variable', 'asignado', 'tools'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(NavbarComponent, {static: false}) navbar:NavbarComponent;

  startDate: any;
  endDate: any;
  filtroFechaForm: FormGroup;
  getEstadosLeadsSubscription: Subscription;
  getAllLeadsColaboradorSubscription: Subscription;
  getLeadsPropensosColaboradorSubscription: Subscription;
  getResumenLeadsColaboradorSubscription: Subscription;
  getCampanasByColaboradorSubscription: Subscription;
  getAllEjecutivosCampanaSubscription: Subscription;
  getLeadsColaboradorSubscription: Subscription;
  headers = null;
  user_cla = null;
  user = null;
  cleanData = null;
  campanas = [];
  states = [];
  ejecutivos = [];
  isPensionado = false;
  resumen = null;
  filterLeadTipo = 0;

  constructor(private route: ActivatedRoute,private _route: Router,
    private authService: AuthService,
    private postgresqlService: PostgresService,
    private firestoreservice: FirestoreService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    
    this.filtroFechaForm = this.formBuilder.group(
        {
          startDate: new FormControl({value: date, disabled: true}, Validators.required),
          endDate: new FormControl({value: new Date(), disabled: true}, Validators.required)
        });

    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
    //this.user.email  julio.arellano@cajalosandes.cl
    this.postgresqlService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla = resp[0];
          this.initialiseInvites();
        }
      });
  }

  initialiseInvites(){
    this.initDate();
    this.getEstadosLeads();
    this.getCampanasByColaborador();
    this.getResumenLeadsColaborador();
    this.getAllLeadsColaborador();
    this.getAllEjecutivosCampana();
  }

  getAllLeadsColaborador(){
    const data = {
      rut_colaborador: parseInt(this.user_cla.rut),
      fechaInicio: this.startDate,
      fechaFin: this.endDate,
      idcargo: parseInt(this.user_cla.id_cargo)
    }
    this.getAllLeadsColaboradorSubscription = this.postgresqlService.getAllLeadsColaborador(data,this.headers).subscribe((data: any) => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = data;
      this.cleanData = data;
      let extractColumn = [...new Set(this.cleanData.map(x=>x['tipo_campana']))];
      this.isPensionado = extractColumn.includes('1');

    });
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

    this.startDate = this.getFechaInteger(startDateFormat);
    this.endDate = this.getFechaInteger(endDateFormat);

    this.filterLead(this.filterLeadTipo);
   }

   filterLead(tipoFiltro: any) {
    this.navbar.getTop11LeadsColaborador();
    this.filterLeadTipo = tipoFiltro;

    if (tipoFiltro === 0) {
      this.getAllLeadsColaborador();
      this.getResumenLeadsColaborador();
    }
    if (tipoFiltro === 1) {
      this.getLeadsColaborador(1, 0);
      this.getResumenLeadsColaborador();
    }
    if (tipoFiltro === 2) {
      const data = {
        rut_colaborador: parseInt(this.user_cla.rut),
        fechaInicio: this.startDate,
        fechaFin: this.endDate,
        idcargo: parseInt(this.user_cla.id_cargo)
      }
      this.getLeadsPropensosColaboradorSubscription = this.postgresqlService.getLeadsPropensosColaborador(data, this.headers).subscribe((data: any) => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.data = data;
      });
      this.getResumenLeadsColaborador();
    }
    if (tipoFiltro === 3) {
      this.getLeadsColaborador(0, 0);
      this.getResumenLeadsColaborador();
    }
    if (tipoFiltro === 4) {
      this.getLeadsColaborador(0, 1);
      this.getResumenLeadsColaborador();
    }
   }

   initDate(){
    const date = new Date();
    date.setDate(date.getDate() - 5);
    this.filtroFechaForm.controls.startDate.setValue(date);
    this.filtroFechaForm.controls.endDate.setValue(new Date());
    this.startDate = this.getFechaInteger(date);
    this.endDate = this.getFechaInteger(new Date());
  }

  getEstadosLeads() {
    this.getEstadosLeadsSubscription = this.postgresqlService.getEstadosLeads(this.headers).subscribe((estados: any) => {
      this.states = estados;
    });

  }


  getResumenLeadsColaborador(){
    const data = {
      rut_colaborador: parseInt(this.user_cla.rut),
      fechaInicio: this.startDate,
      fechaFin: this.endDate,
      idcargo: parseInt(this.user_cla.id_cargo)
    }

    this.getResumenLeadsColaboradorSubscription = this.postgresqlService.getResumenLeadsColaborador(data,this.headers).subscribe((data: any) => {
      this.resumen = data[0];
    });
  }


  getCampanasByColaborador(){
    this.getCampanasByColaboradorSubscription = this.postgresqlService.getCampanasByColaborador(parseInt(this.user_cla.rut), this.headers).subscribe((data: any) => {
      this.campanas = data;
    });
  }

  getAllEjecutivosCampana(){
    this.getAllEjecutivosCampanaSubscription = this.postgresqlService.getAllEjecutivosCampana(this.headers).subscribe((data: any) => {
      this.ejecutivos = data;
    });
  }

  updateEjecutivoLead(data){
    this.postgresqlService.updateEjecutivoLead(data, this.headers).subscribe(res=> res ,
    err => {
      console.error(err)
    },
    ()=> {
      this.filterLead(this.filterLeadTipo);
    }
  )
  }

  getLeadsColaborador(nuevo, gestionado){
    const data = {
      rut_colaborador: parseInt(this.user_cla.rut),
      nuevo: nuevo,
      gestionado: gestionado,
      fechaInicio: this.startDate,
      fechaFin: this.endDate,
      idcargo: parseInt(this.user_cla.id_cargo)
    }
    this.getLeadsColaboradorSubscription = this.postgresqlService.getLeadsColaborador(data,this.headers).subscribe((data: any) => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = data;
      this.cleanData = data;
    });
   }

  onLead(id: any) {
    this._route.navigate(['form-lead', id] , {skipLocationChange: true});
   }

   getFechaInteger(fecha) {
    const mes = '0' + (fecha.getMonth() + 1).toString();
    const dia = '0' + (fecha.getDate()).toString();
    return parseInt(fecha.getFullYear() + mes.substring(mes.length, mes.length - 2) + dia.substring(dia.length, dia.length - 2));
  }


  applyFilterChange(value: any) {
    if(typeof value === 'undefined'){
      return;
    }
    this.dataSource.data = this.cleanData.filter( element => parseInt(element.id_estado) === value);
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    let filterValue = value.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

    onChange(event){
      let dato = event.split('-');
      let data = {
        id: Number(dato[0]),
        rut: Number(dato[1]),
        email: dato[2]
      };
      this.updateEjecutivoLead(data);
      Swal.fire({
        title: 'OK',
        text: 'Reasignado Correctamente',
        type: 'success'
      }).then(function() {

    });
     }

     ngOnDestroy(): void {
      // avoid memory leaks here by cleaning up after ourselves. If we
      // don't then we will continue to run our initialiseInvites()
      // method on every navigationEnd event.
      if (this.getEstadosLeadsSubscription) {
         this.getEstadosLeadsSubscription.unsubscribe();
      }

      if (this.getAllLeadsColaboradorSubscription) {
        this.getAllLeadsColaboradorSubscription.unsubscribe();
     }

      if (this.getLeadsPropensosColaboradorSubscription) {
        this.getLeadsPropensosColaboradorSubscription.unsubscribe();
      }
      if (this.getResumenLeadsColaboradorSubscription) {
        this.getResumenLeadsColaboradorSubscription.unsubscribe();
      }
      if (this.getCampanasByColaboradorSubscription) {
        this.getCampanasByColaboradorSubscription.unsubscribe();
      }

      if (this.getAllEjecutivosCampanaSubscription) {
        this.getAllEjecutivosCampanaSubscription.unsubscribe();
      }
      if (this.getLeadsColaboradorSubscription) {
        this.getLeadsColaboradorSubscription.unsubscribe();
      }

    }
}
