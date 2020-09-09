import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { ApiMercadopagoService } from '../../services/api-mercadopago.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { Subscription } from 'rxjs';
import { get } from 'scriptjs';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'id', 'campana', 'bco_origen','bco_destino', 'tools'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  hoy : any;
  init_point: any;
  headers = null;
  user=null;
  getLeadByBancoSubscription: Subscription;
  items: any;
  ofertas: any;    

  constructor( private postgresqlService: PostgresService,
    private checkoutService: CheckoutService,
    private apiMercadopagoService: ApiMercadopagoService,
    private authService: AuthService) { 

    }

  ngOnInit(): void {
    
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
    //this.user.email  julio.arellano@cajalosandes.cl
    this.postgresqlService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user = resp[0];
          console.log(this.user);
          this.getConfiguradorOferta();
          
        }
      });
  /*  this.postgresqlService.getFlow(this.items).subscribe(res=>{
      
        console.log(res);
      });*/

  /* get("https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js", () => {
      //library has been loaded...
    });*/
  }

  getConfiguradorOferta(){
  this.postgresqlService.getConfiguradorOferta(this.headers).subscribe(res=>{
    this.ofertas = res;
    console.log('this.oferta ==>', this.ofertas);
    });
  }

 

  applyFilter(value: string) {
    let filterValue = value.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

}






