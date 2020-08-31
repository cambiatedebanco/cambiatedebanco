import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router,NavigationEnd} from '@angular/router';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../utility';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  navigationSubscription;
  userPerfil: any;
  headers: any;
  user: any;
  view = false;
  idcargo: any;
  private subscriptionCreditoTotal: Subscription;

  constructor(
    public firestoreservice: FirestoreService,
    private authService: AuthService,
    private route: Router,
    private postgresService: PostgresService) {
    this.navigationSubscription = this.route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });

  }

  initialiseInvites(){
    this.userPerfil = this.authService.isUserLoggedInPerfil();
    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn())
    this.user = this.authService.isUserLoggedIn();
    this.getCarteraCreditos();
  }

  private getCarteraCreditos(){
    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.idcargo = parseInt(resp[0].id_cargo)
          this.postgresService.getVistaUsuarioCantidad(resp[0].rut, this.idcargo, getHeaderStts(this.user)).subscribe((data: any) => {

            if(parseInt(data[0].n_total) > 0){
              this.view = true;
            }

         });

        }
      });



  } 
  
  
  ngOnInit() {
  }




  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
    if(this.subscriptionCreditoTotal){
      this.subscriptionCreditoTotal.unsubscribe();
    }
  }

}
