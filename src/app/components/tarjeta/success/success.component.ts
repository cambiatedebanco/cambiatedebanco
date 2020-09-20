import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { methods } from 'underscore';
import { PostgresService } from '../../../services/postgres/postgres.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { getHeaderStts } from '../../utility';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit, OnDestroy {
  showVariable: any;
  headers = null;
  navigationSubscription: Subscription;
  user = null;
  user_cla:any;
  resultado:any;
  subsUsMail: Subscription;
  hoy:any;
  constructor(  private route: ActivatedRoute,
    private _route: Router,
    private _postgresqlService:PostgresService,
    private authService: AuthService
    ) { }

  ngOnInit( ) {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())


    this.user =this.authService.isUserLoggedIn();
 
    this.subsUsMail = this._postgresqlService.getUsuarioPorMail(this.user.email , getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.user_cla=resp[0];          
          this.initialiseInvites(this.user_cla);
        }
      });

  
   
  }

  initialiseInvites(user_cla:any){
    let data={
      rutint: user_cla.rut
    };
    this._postgresqlService.getStatusSuccess(data).subscribe(res=>{

      this.resultado= res[0];

    }
      );

  }

  ngOnDestroy(): void {


  

    if (this.subsUsMail) {
      this.subsUsMail.unsubscribe();
    }

  
  }


}
