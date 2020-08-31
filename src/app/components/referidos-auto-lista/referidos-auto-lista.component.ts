import { Component, OnInit} from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-referidos-auto-lista',
  templateUrl: './referidos-auto-lista.component.html',
  styleUrls: ['./referidos-auto-lista.component.css']
})
export class ReferidosAutoListaComponent implements OnInit {
  public misReferidos: any = [];
  user: any;
  rut: any;
  navigationSubscription;
  constructor(public _firestoreservice: FirestoreService, private _route: Router, private _auth: AuthService, private postgresService: PostgresService) { 
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

initialiseInvites() {
  this._auth.getestado();
  this.user = this._auth.isUserLoggedIn();

  this.postgresService.getUsuarioPorMail(this.user.email.toUpperCase(), getHeaderStts(this.user)).subscribe(
    data => {
      if(data)
      {
        let temp = data[0]
        this.rut = temp.rut;
        this._firestoreservice.getReferidosAutoAll(this.rut).subscribe((referidoSnapShot: any) => {
          this.misReferidos = [];
          referidoSnapShot.forEach((referidos: any) => {
            this.misReferidos.push({
              id: referidos.payload.doc.id,
              data: referidos.payload.doc.data()
            });
          });
        });
      }
      }
  )
}

ngOnInit() {
  registerLocaleData( es );
}

}