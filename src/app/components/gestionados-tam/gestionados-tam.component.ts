import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from '../utility';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY } from 'ng-pick-datetime/date-time/date-time-picker.component';


@Component({
  selector: 'app-gestionados-tam',
  templateUrl: './gestionados-tam.component.html',
  styleUrls: ['./gestionados-tam.component.css']
})
export class GestionadosTamComponent implements OnInit, OnDestroy {
  dataSourceGestion: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, { static: false }) sortGestion: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumnsGestion: string[] = ['nombre', 'rut', 'estado','fecha']

  tamGestionSubscription: Subscription;

  filtroFechaForm = new FormGroup({
    startPicker: new FormControl({}, Validators.required),
    endPicker: new FormControl({}, Validators.required)
  })

  get fromDate() { return this.filtroFechaForm.get('startPicker').value; }
  get toDate() { return this.filtroFechaForm.get('endPicker').value; }
  headers: any;
  public isData = false;
  hoy = null;
  referenceAtm: any[];
  states: any =[];

  constructor(private postgresService: PostgresService,
    private authService: AuthService) { 
      
      this.dataSourceGestion.filterPredicate = (data, filter) => {
        let start = new Date(this.fromDate).setHours(0,0,0,0)
        let end = new Date(this.toDate).setHours(0,0,0,0)
        let solicitud = new Date(data.fecha_solicitud).setHours(0,0,0,0)
        return solicitud >= start && solicitud <= end
      }
    }

  ngOnInit() {
    this.hoy= Date();
    let user = this.authService.isUserLoggedIn()
    this.headers = getHeaderStts(user);
    this.getAtmGestionado(user);
    this.getStatesTam();
  }

  getAtmGestionado(user) {
    this.tamGestionSubscription = this.postgresService.getTamColaborador(this.headers).
      subscribe(result => {
        this.dataSourceGestion.sort = this.sortGestion;
        this.dataSourceGestion.paginator = this.paginator;
        this.dataSourceGestion.data = result;
        this.referenceAtm = result;
        if(result.length > 0){
          this.filtroFechaForm.setControl('startPicker', new FormControl(result[0].fecha_solicitud))
          this.filtroFechaForm.setControl('endPicker', new FormControl(result[0].fecha_solicitud))
        }
      }, error => {
        console.error(error)
      })
  }

  exportCsv() {
    let start = new Date(this.fromDate).setHours(0,0,0,0)
    let end = new Date(this.toDate).setHours(0,0,0,0)
    this.updateTamDescargado(start, end)

    // let data = [];
    // if (!this.fromDate || !this.toDate) {
    //   data = this.referenceAtm;
    // }else{
    //   data = this.referenceAtm.filter((element) => {
    //     return new Date(element.fecha_solicitud).setHours(0,0,0,0) >= start && new Date(element.fecha_solicitud).setHours(0,0,0,0) <= end })
    // }


    // if (data.length === 0) {
    //   //swal ?
    //   console.log("khe")
    //   return;
    // }
    
    // const replacer = (key, value) => (value === null ? '' : value);
    // const header = Object.keys(data[0]);
    // const csv = data.map((row) =>
    //   header
    //     .map((fieldName) => JSON.stringify(row[fieldName], replacer))
    //     .join(';')
    // );
    // csv.unshift(header.join(';'));
    // const csvArray = csv.join('\r\n');
    // const a = document.createElement('a');
    // const blob = new Blob([csvArray], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);

    // a.href = url;
    // a.download = `gestion_${this.getDateWithFormat( new Date(this.fromDate))}_${this.getDateWithFormat(new Date(this.toDate))}.csv`
    // a.click();
    // window.URL.revokeObjectURL(url);
    // a.remove();
   
  }

  updateTamDescargado(start, end){ 
    let data = {start: start, end: end}
    this.postgresService.updateTamDescargado(this.headers, data).
    subscribe(_ => { 
      this.prepareCsv(data);
    })
  }
  prepareCsv(data){
    data.gestionado = 1;
    let param = `?start=${data.start}&end=${data.end}&gestionado=${data.gestionado}`
    this.postgresService.getTamColaborador(this.headers, param).subscribe(result => {
      if (result.length === 0) {
        //swal ?
        return;
      }
      const replacer = (key, value) => (value === null ? '' : value);
      const header = Object.keys(result[0]);
      const csv = result.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer).replace('\"', '').replace('\"', ''))
          .join(';')
      );
      csv.unshift(header.join(';'));
      const csvArray = csv.join('\r\n');
      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
  
      a.href = url;
      a.download = `gestion_${this.getDateWithFormat( new Date(this.fromDate))}_${this.getDateWithFormat(new Date(this.toDate))}.csv`
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

    })
  }

  filterString(value: any){
    if(typeof value ==='string'){
      return value.replace('/"', '')
    }
    console.log(value)
    return value;
  }

  applyFilterGestion(value: string) {    
    value = value.trim();
    value = value.toLowerCase();
    this.dataSourceGestion.filter = value;
  }

  onSubmitDateRange() {
    this.dataSourceGestion.filter = '' + Math.random();

  }
getDateWithFormat(date=new Date()){
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  return month < 10 ? `${year}0${month}${day}` : `${year}${month}${day}`
 
  }

  getStatesTam() {
    this.postgresService.getEstadosTam(this.headers).subscribe(_=>{
      this.states = _
    }, error => {
      console.error(error)
    })
  }

  applyFilterChange(value: any) {
    if(typeof value === 'undefined'){
      return;
    }
    this.dataSourceGestion.data = this.referenceAtm.filter( element => element.nombre_estado === value);
    this.dataSourceGestion.sort = this.sortGestion;
  }


  ngOnDestroy() {
    if (typeof this.tamGestionSubscription !== 'undefined') {
      this.tamGestionSubscription.unsubscribe()
    }
  }

}
