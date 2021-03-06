import {Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Chart } from 'angular-highcharts';
import { Options } from 'highcharts';
import { Subscription } from 'rxjs';
import { getHeaderStts } from '../../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';

@Component({
  selector: 'app-cartera-home',
  templateUrl: './cartera-home.component.html',
  styleUrls: ['./cartera-home.component.css']
})
export class CarteraHomeComponent implements OnInit, OnDestroy {

  @ViewChild('paginator', {static: true}) paginator: MatPaginator;
  @ViewChild('sort', {static: true}) sort: MatSort;


  @ViewChild('paginatorLeads', {static: true}) paginatorLeads: MatPaginator;
  @ViewChild('sortLeads', {static: true}) sortLeads: MatSort;

  @ViewChild(NavbarComponent, {static: false}) navbar:NavbarComponent;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ['fecha', 'id', 'campana', 'bco_origen','bco_destino', 'monto', 'tools'];

  dataSourceLeads: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsLeads: string[] = ['fecha', 'rut', 'nombre', 'campana', 'variable', 'asignado', 'modifica'];
  chart: Chart;
  chart2: Chart;
  user = null;
  headers = null;
  options: Options;
  options2: Options;
  navigationSubscription: Subscription;
  getEstadosLeadsSubscription: Subscription;
  getResumenLeadsColaboradorSubscription: Subscription;
  getMicarteraCreditosSubscription: Subscription;
  getMicarteraCreditosSubscription2: Subscription;
  getMicarteraCreditosTotalSubscription: Subscription;
  getLeads_totalSubscription: Subscription;
  getDiasRestantesSubscription: Subscription;
  getCampanasByColaboradorSubscription: Subscription;
  getLeadsColaboradorSubscription: Subscription;
  getMicarteraCreditosPendientesSubscription: Subscription;
  getMicarteraCreditosGestionadoSubacription: Subscription;
  getMicarteraEjecutivosSubscription: Subscription;
  getVistaUsuarioCantidadSubscription: Subscription;
  dataUsers = [];
  diasRestantes = [];
  dataUsersLeads = [];
  ejecutivos = [];
  ejecutivosc = [];
  hoy : any;
  user_cla : any;
  userPerfil: any;
  states = [];
  cleanData = [];
  cleanDataLead = [];
  getAllEjecutivosCampanaSubscription: Subscription;
  getLeadByBancoSubscription: Subscription;
  getCreditosByRutSubscription: Subscription;
  campanas: [];
  filtroFechaForm: FormGroup;
  tabFilterLead = 1;
  startDate: any;
  endDate: any;
  tabFilter = null;
  resumen: any;
  creditos = null;

  public cookieTab: string;
  constructor(   private route: ActivatedRoute,private _route: Router,
                 private authService: AuthService,
                 private postgresqlService: PostgresService,
                 private formBuilder: FormBuilder,
                 private firebaseStorage: FirebaseStorageService) {


    /*this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        //this.initialiseInvites();
      }
    });*/
  }
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

    this.postgresqlService.getUsuarioPorMail(this.user.email , getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];          
          this.initialiseInvites(this.user_cla);
        }
      });
      
  }



 initialiseInvites(user_cla:any){

    


      this.getMicarteraCreditosTotalSubscription = this.postgresqlService.getMicarteraCreditosTotal(user_cla.rut , user_cla.id_cargo, this.headers).subscribe((data: any) => {
         this.dataUsers = data;  
         this.getLeads_totalSubscription = this.postgresqlService.getLeads_total(user_cla.rut , user_cla.id_cargo, this.headers).subscribe((data: any) => {
          this.dataUsersLeads = data;
          this.init();
       });      

      });

      

      this.getDiasRestantesSubscription = this.postgresqlService.getDiasRestantes(this.headers).subscribe((data: any) => {
        this.diasRestantes = data;
     });

      if (user_cla.id_cargo==1 || user_cla.id_cargo ==2){
        this.getMicarteraEjecutivosSubscription = this.postgresqlService.getMicarteraEjecutivos(user_cla.rut , user_cla.id_cargo, this.headers).subscribe((data: any) => {
      this.ejecutivosc = data;

   });
  }
  //this.firebaseStorage.downloadFile();
      this.prepareLocalStorage();
      this.initDate();
      this.getEstadosLeads(this.headers);
      this.getCampanasByColaborador(user_cla.rut, this.headers);
      this.getLeadsColaborador(1, 0);
      this.getAllEjecutivosCampana();
      this.getResumenLeadsColaborador();
      this.getCreditosByRut();
      this.getLeadByBanco();
      this.navbar.getTop11LeadsColaborador();
      

  }

  getCreditosByRut(){
    this.getCreditosByRutSubscription = this.postgresqlService.getCreditosByRut(this.user_cla.rut, this.headers).subscribe((data: any) => {
      this.creditos = data[0];
      console.log('this.creditos ==> ',this.creditos);
    });
  }

  getLeadByBanco(){
  this.getLeadByBancoSubscription = this.postgresqlService.getLeadByBanco(this.user_cla.idbanco, this.headers).subscribe((data: any) => {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = data;
  });
}
  onComprar(id){
    this.getCreditosByRut();
    if(parseInt(this.creditos.credito_saldo) > 0){
      Swal.fire({
        title: 'Comprar',
        text: `Tiene un saldo de ${this.creditos.credito_saldo} créditos`,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si, Comprar!',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          let dataSaldo ={
            utilizado: parseInt(this.creditos.credito_utilizado) + 1,
            rut: this.user_cla.rut
          }

          let dataAsign ={
            rut: parseInt(this.user_cla.rut),
            email: this.user_cla.email.toLowerCase(),
            id: id
          }

          this.postgresqlService.updateCreditos(dataSaldo, this.headers).subscribe((_ => {
            this.postgresqlService.updateAsignLeadsCb(dataAsign, this.headers).subscribe((_ => {
              this.getCreditosByRut();
              this.getLeadByBanco();
              this.getResumenLeadsColaborador();
              this.getLeadsColaborador(1, 0);
              Swal.fire(
                'Comprado!',
                'Compra exitosa lead asignado.',
                'success'
              );
            }));
            
          }))
          
        }
      });
    }else{
      Swal.fire({
        title: 'Ups!',
        text: 'Saldo insuficiente',
        type: 'warning'
      }).then(() => {
      });
    }
    

    
  }

  getAllEjecutivosCampana(){
    this.getAllEjecutivosCampanaSubscription = this.postgresqlService.getAllEjecutivosCampana(this.headers).subscribe((data: any) => {
      this.ejecutivos = data;
    });
  }

  getCampanasByColaborador(rut, headers){
    this.getCampanasByColaboradorSubscription = this.postgresqlService.getCampanasByColaborador(rut, headers).subscribe((data: any) => {
      this.campanas = data;
    });
  }

  initDate(){
    const date = new Date();
    date.setDate(date.getDate() - 5);
    this.filtroFechaForm.controls.startDate.setValue(date);
    this.filtroFechaForm.controls.endDate.setValue(new Date());
    this.startDate = this.getFechaInteger(date);
    this.endDate = this.getFechaInteger(new Date());
  }
       onFichaAfiliado(id){
        const time = new Date();
        const mes = '0' + (time.getMonth() + 1).toString();
        const dia = '0' + (time.getDate()).toString();
        const periodo = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2));
        const fecha = parseInt(time.getFullYear() + '' + mes.substring(mes.length, mes.length - 2)  +''+ dia.substring(dia.length, dia.length - 2));

        const dataUpdate = {
          fecha_date_gestion: time,
          periodo_gestion: periodo,
          fecha_gestion: fecha,
          rut_persona: id
        };

        if(Number(this.user_cla.id_cargo) !== 1 && 
        Number(this.user_cla.id_cargo) !== 2 && 
        Number(this.user_cla.id_cargo) !== 4){
          this.updateBaseLeadsPendientes(dataUpdate);
        }

        this._route.navigate(['mi-ficha', id] , {skipLocationChange: true});

       }

      onClickTabLead(tipoFiltro: any){
        this.tabFilterLead = tipoFiltro;
        //this.initDate();
        this.filterLead(this.tabFilterLead);
      }

       filterLead(tipoFiltro: any) {
        this.navbar.getTop11LeadsColaborador();
        if (tipoFiltro === 1) {
          this.getLeadsColaborador(1, 0);
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
          this.dataSourceLeads.sort = this.sortLeads;
          this.dataSourceLeads.paginator = this.paginatorLeads;
          this.dataSourceLeads.data = data;
          this.cleanDataLead = data;
        });
       }

       filterBase(tipoFiltro: any) {
        this.tabFilter = tipoFiltro;
        if (tipoFiltro === 1){
          this.getMicarteraCreditosSubscription2 = this.postgresqlService.getMicarteraCreditos(this.user_cla.rut, this.user_cla.id_cargo,this.headers).subscribe((data: any) => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.data = data;
         });
        }
        if (tipoFiltro === 2) {
          this.getMicarteraCreditosPendientesSubscription = this.postgresqlService.getMicarteraCreditosPendientes(this.user_cla.rut, this.user_cla.id_cargo, this.headers).subscribe((data: any) => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.dataSource.data = data;

         });
        }
        if (tipoFiltro === 3) {
        this.getMicarteraCreditosGestionadoSubacription = this.postgresqlService.getMicarteraCreditosGestionado(this.user_cla.rut, this.user_cla.id_cargo, this.headers).subscribe((data: any) => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.cleanData = data;
          this.dataSource.data = data;

       });

      }
      }

      updateBaseLeadsPendientes(data){
        this.postgresqlService.updateBaseLeadsPendientes(data, this.headers).subscribe(res=> res ,
        err => {
          console.error(err)
        },
        ()=> {
        }
      )
      }


      getEstadosLeads(headers: any) {
        this.getEstadosLeadsSubscription = this.postgresqlService.getEstadosLeads(headers).subscribe((estados: any) => {
          this.states = estados;
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
        this.filterLead(this.tabFilterLead);
       }

       applyFilterChangeBase(value: any) {
        if(typeof value === 'undefined'){
          return;
        }
        this.dataSource.data = this.cleanData.filter( element => parseInt(element.id_estado) === value);
        this.dataSource.sort = this.sort;
      }
      applyFilterBase(value: string) {
        let filterValue = value.trim();
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        }

        applyFilterChangeLead(value: any) {
          if(typeof value === 'undefined'){
            return;
          }
          this.dataSourceLeads.data = this.cleanDataLead.filter( element => parseInt(element.id_estado) === value);
          this.dataSourceLeads.sort = this.sortLeads;
        }
        applyFilterLead(value: string) {
          let filterValue = value.trim();
          filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
          this.dataSourceLeads.filter = filterValue;
        }


        onGestionar(id: any) {
          this._route.navigate(['cartera-gestion', id] , {skipLocationChange: true});
         }

       onLead(id: any) {
        this._route.navigate(['form-lead', id] , {skipLocationChange: true});
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

       updateEjecutivoLead(data){
        this.postgresqlService.updateEjecutivoLead(data, this.headers).subscribe(res=> res ,
        err => {
          console.error(err)
        },
        ()=> {
          this.filterLead(this.tabFilterLead);
        }
      )
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
    
       
       getFechaInteger(fecha) {
        const mes = '0' + (fecha.getMonth() + 1).toString();
        const dia = '0' + (fecha.getDate()).toString();
        return parseInt(fecha.getFullYear() + mes.substring(mes.length, mes.length - 2) + dia.substring(dia.length, dia.length - 2));
      }
    
      updateCookieTab(value:string){
        this.cookieTab = value;
        localStorage.setItem('cookieTab', this.cookieTab);
      }

      prepareLocalStorage(){
        if (typeof localStorage.getItem('cookieTab') === 'undefined' || localStorage.getItem('cookieTab') ==null){
        this.getVistaUsuarioCantidadSubscription = this.postgresqlService.getVistaUsuarioCantidad(parseInt(this.user_cla.rut), parseInt(this.user_cla.id_cargo), this.headers).subscribe((data: any) => {

        const n_total_leads = Number(data[0].n_total_leads);
        const n_total_cartera = Number(data[0].n_total_cartera);
          
        if(parseInt(this.user_cla.id_cargo) === 1 || parseInt(this.user_cla.id_cargo) === 2){
            localStorage.setItem('cookieTab', 'default');
        }else if(parseInt(this.user_cla.id_cargo) === 4){
            localStorage.setItem('cookieTab', 'bell');
        }else{
            if(n_total_leads > 0 && n_total_cartera > 0){
              localStorage.setItem('cookieTab', 'default');
            }
            if(n_total_cartera > 0 && n_total_leads === 0){
              localStorage.setItem('cookieTab', 'default');
            }
            if(n_total_cartera === 0 && n_total_leads > 0){
              localStorage.setItem('cookieTab', 'bell');
            }
          }
            this.cookieTab = localStorage.getItem('cookieTab');

        });
      }else{
        this.cookieTab = localStorage.getItem('cookieTab');
      }
    }

      init() {
        let cumplimiento=Math.round((((this.dataUsers[0].n_gestion + this.dataUsersLeads[0].n_gestion) / (this.dataUsersLeads[0].n_total + this.dataUsers[0].n_total))*100));
        let restante= 100 - cumplimiento;
        this.hoy= Date();
        this.options2={
          chart: {
              type: 'bar'
          },
          title: {
              text: ''
          },
          xAxis: {
              categories: ['Credito', 'Seguro', 'Ahorro', 'Mora','Leads']
          },
          credits: {
            enabled: false,
           },
          yAxis: {
              min: 0,
              title: {
                  text: 'Total Gestion'
              }
          },
          tooltip: {
              pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
              shared: true
          },
          plotOptions: {
              bar: {
                  stacking: 'percent',
                  pointWidth: 15,
          minPointLength: 50,
          dataLabels: {
            enabled: true
          }
              }
          },
          series: [{
            type:'bar',
              name: 'No Gestionados',
              color: '#f9be00',
              data: [56,47,21,20,5]
          }, {
            type:'bar',
              name: 'Gestionados',
              color: '#1e88e5',
              data: [28,16,5,15,15]
          }]
      };
    
        this.options = {
              chart: {
                  type: 'pie',
                  margin: [0, 0, 0, 0],
                  spacingTop: 0,
                  spacingBottom: 0,
                  spacingLeft: 0,
                  spacingRight: 0
              },
               plotOptions: {
                pie: {
                  size:'100%',
                  shadow: false,
                  borderColor: null
                }
              },
              title: {
                text: cumplimiento +'%',
                align: 'center',
                verticalAlign: 'middle',
                  style: {
                      fontSize: '14px',
                      fontWeight: 'bold'
                  }
    
            },
              credits: {
                enabled: false,
               },
              series: [{
                type:'pie',
                name: 'meta',
                data: [{
                   y: cumplimiento ,
                  name: 'cumplimiento',
                  color: "#1e88e5"
                }, {
                   y: restante,
                  name:'',
                  color: "#f9be00"
                }],
                size: '100%',
                innerSize: '70%',
                dataLabels: {
                  enabled: false
                },
                marker: {
                  symbol: 'square',
                  radius: 12
                }
              }]
            };
        const chart = new Chart(this.options);
    
        this.chart = chart;
    
        const chart2 = new Chart(this.options2);
    
        this.chart2 = chart2;
    
          }

      ngOnDestroy(): void {

        if (this.getMicarteraCreditosSubscription ) {
            this.getMicarteraCreditosSubscription.unsubscribe();
        }
        if (this.getMicarteraCreditosTotalSubscription ) {
          this.getMicarteraCreditosTotalSubscription.unsubscribe();
        }
        if (this.getLeads_totalSubscription ) {
          this.getLeads_totalSubscription.unsubscribe();
        }
        
        if (this.getDiasRestantesSubscription ) {
          this.getDiasRestantesSubscription.unsubscribe();
        }
        
        if (this.getCampanasByColaboradorSubscription) {
          this.getCampanasByColaboradorSubscription.unsubscribe();
        }

        if (this.getResumenLeadsColaboradorSubscription) {
          this.getResumenLeadsColaboradorSubscription.unsubscribe();
        }

        if (this.getEstadosLeadsSubscription) {
          this.getEstadosLeadsSubscription.unsubscribe();
        }
        
        if (this.getAllEjecutivosCampanaSubscription) {
          this.getAllEjecutivosCampanaSubscription.unsubscribe();
        }

        if (this.getLeadsColaboradorSubscription) {
          this.getLeadsColaboradorSubscription.unsubscribe();
        }

        if (this.getMicarteraCreditosPendientesSubscription) {
          this.getMicarteraCreditosPendientesSubscription.unsubscribe();
        }

        if (this.getMicarteraCreditosGestionadoSubacription) {
          this.getMicarteraCreditosGestionadoSubacription.unsubscribe();
        }

        if (this.getMicarteraCreditosSubscription2) {
          this.getMicarteraCreditosSubscription2.unsubscribe();
        }
        
        if (this.getMicarteraEjecutivosSubscription) {
          this.getMicarteraEjecutivosSubscription.unsubscribe();
        }
        
        if (this.getVistaUsuarioCantidadSubscription) {
          this.getVistaUsuarioCantidadSubscription.unsubscribe();
        }
        
      }

     
}
