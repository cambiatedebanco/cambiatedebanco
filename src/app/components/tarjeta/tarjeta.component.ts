import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fecha', 'id', 'campana', 'bco_origen','bco_destino', 'tools'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  hoy : any;
  init_point: any;
  headers = null;
  user=null;
  user_cla = null;
  getLeadByBancoSubscription: Subscription;
  subsUsuMail: Subscription;
  subsConfOfer: Subscription;
  subsCredRut: Subscription;
  items: any;
  ofertas: any;
  creditos=null;
  constructor( private postgresqlService: PostgresService,
    private authService: AuthService) { 

    }
    
  ngOnInit(): void {
    this.user_cla = JSON.parse(localStorage.getItem('user_perfil'));
    this.user = this.authService.isUserLoggedIn();
    this.headers = getHeaderStts(this.user);
    this.getConfiguradorOferta();
    this.getCreditosByRut();
  }

  getConfiguradorOferta(){
  this.subsConfOfer = this.postgresqlService.getConfiguradorOferta(this.headers).subscribe(res=>{
    this.ofertas = res;
    });
  }

  getCreditosByRut(){
    this.subsCredRut = this.postgresqlService.getCreditosByRut(this.user_cla.rut, this.headers).subscribe((data: any) => {
      this.creditos = data[0];
    });
  }

  applyFilter(value: string) {
    let filterValue = value.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

    ngOnDestroy(): void {

      if (this.subsUsuMail ) {
        this.subsUsuMail.unsubscribe();
      }

      if (this.subsConfOfer ) {
        this.subsConfOfer.unsubscribe();
      }
      
      if (this.subsCredRut ) {
        this.subsCredRut.unsubscribe();
      }
      
    }
}






