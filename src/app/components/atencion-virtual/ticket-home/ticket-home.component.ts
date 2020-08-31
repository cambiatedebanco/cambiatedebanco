import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../../utility';

@Component({
  selector: 'app-ticket-home',
  templateUrl: './ticket-home.component.html',
  styleUrls: ['./ticket-home.component.css']
})
export class TicketHomeComponent implements OnInit, OnDestroy  {
  ticketNuevos: any = [];
  ticketEnEspera: any = [];
  ticketTermnados: any = [];
  navigationSubscription;
  user: any;
  rutEjecutivo: any;
  countNuevos: number;
  countEspera: number;
  countTerminados: number;
  statusUpdateTicket: any;

  constructor(
    public firestoreservice: FirestoreService,
    private router: Router,
    private auth: AuthService, private postgresService: PostgresService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
   }

  initialiseInvites() {
    this.auth.getestado();
    this.user = this.auth.isUserLoggedIn();
    this.postgresService.getUsuarioPorMail(this.user.email.toUpperCase(), getHeaderStts(this.user))
    .subscribe(resp =>{
      let data = resp[0];
      this.rutEjecutivo = data.rut;
      this.firestoreservice.getTicketsEjecutivo(this.rutEjecutivo).subscribe((ticketsSnap: any) => {
        this.ticketNuevos = [];
        this.ticketEnEspera = [];
        this.ticketTermnados = [];
        this.countNuevos = 0;
        this.countEspera = 0;
        this.countTerminados = 0;
        ticketsSnap.forEach((ticket: any) => {
          if (ticket.payload.doc.data().estado === 1) {
            //this.getDateDiff(ticket.payload.doc.data().fecha_actualizacion);
            this.ticketNuevos.push({
              id: ticket.payload.doc.id,
              updateTicket: 'hace unos minutos',
              //updateTicket: this.getDateDiff(ticket.payload.doc.data().fecha_actualizacion),
              data: ticket.payload.doc.data()
            });
            this.countNuevos ++;
          } else if (ticket.payload.doc.data().estado === 2) {
            this.ticketEnEspera.push({
              id: ticket.payload.doc.id,
              data: ticket.payload.doc.data()
            });
            this.countEspera ++;
          } else {
            this.ticketTermnados.push({
              id: ticket.payload.doc.id,
              data: ticket.payload.doc.data()
            });
            this.countTerminados ++;
          }
        });
      });
    })
  }

  getDateDiff(dateLasUpdate) {
    this.statusUpdateTicket = '';
    const date = new Date();
    const lastUpdateSeconds = parseInt(dateLasUpdate.seconds);
    const nowSeconds =  parseInt(date.getTime().toString().substr(0, 10));

    const diffSeconds = nowSeconds - lastUpdateSeconds;

    if ( diffSeconds < 60 ) {
      this.statusUpdateTicket = 'hace unos segundos';
    }

    if ( diffSeconds >= 60 && diffSeconds < 3600 ) {
      this.statusUpdateTicket = 'hace unos minutos';
    }

    if ( diffSeconds >= 3600 && diffSeconds < 8400) {
      this.statusUpdateTicket = 'hace unas horas';
    }

    if ( diffSeconds >= 8400 && diffSeconds < 58800) {
      this.statusUpdateTicket = 'hace unos días';
    }

    if ( diffSeconds >= 58800 ) {
      this.statusUpdateTicket = 'hace más de una semana';
    }

    return this.statusUpdateTicket;

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
  }

}
