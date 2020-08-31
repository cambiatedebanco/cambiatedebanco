import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Component({
  selector: 'app-ticket-terminados',
  templateUrl: './ticket-terminados.component.html',
  styleUrls: ['./ticket-terminados.component.css']
})
export class TicketTerminadosComponent implements OnInit, OnDestroy {
  @Input() ticketTermnados: any;
  @Input() countTerminados: any;
  navigationSubscription;
  constructor(
    public firestoreservice: FirestoreService,
    private router: Router) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });

   }

  ngOnInit() {}

  initialiseInvites() {}

  onCambiaEstado(idDoc, state) {
    const date = new Date();
    const data = {
      estado: state,
      fecha_actualizacion: date
    };

    this.firestoreservice.updateEstadoTicketAtencion(idDoc, data);

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
