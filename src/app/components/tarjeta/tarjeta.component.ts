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
          this.items = {
            email: this.user.email.toLowerCase(),
            rut: this.user.rut+'-'+this.user.dv,
            rutint: this.user.rut,
            monto: 5000
          }
        }
      });
  /*  this.postgresqlService.getFlow(this.items).subscribe(res=>{
      
        console.log(res);
      });*/

  /* get("https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js", () => {
      //library has been loaded...
    });*/
  }

  onBuy() {
   /* this.checkoutService.goCheckOut(this.preference).then(result => {
      // Read result of the Cloud Function.
      this.init_point = result.data.result;
      console.log(this.init_point);
      //window.location.href = this.init_point;
    }).catch(error => {
      console.log(error);
      return erryyyyor
    });*/
    this.postgresqlService.getFlow(this.items).subscribe(res=>{
      this.init_point = res.redirect;
        console.log(this.init_point);
        window.open(this.init_point, '_blank');
      });
    /*this.apiMercadopagoService.getMP(this.items).subscribe(res=>{
      this.init_point = res.url;
        console.log(this.init_point);
        window.open(this.init_point, '_blank');
        //window.location.href = this.init_point;
      });*/
  }


  
  

  applyFilter(value: string) {
    let filterValue = value.trim();
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    }

}






