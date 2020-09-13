import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaderStts } from '../utility';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @Output() idEmmiter = new EventEmitter<any>();
  stateCtrl = new FormControl();
  public empresas: any = [];
  loggedIn: boolean;
  user: any;
  responseMessage: string = '';
  responseMessageType: string = '';
  navigationSubscription;

  gestionesPendienteAgendada = [];
  nearAlerts = [];

  subscriptionGestionPendiente: Subscription;
  postgresServiceSubscription: Subscription;
  searchterm: string;
  tipo: any;
  startAt = new Subject();
  endAt = new Subject();
  public myRadio: any;
  public emps: any;
  public allemps: any;
  totales: number;
  notifica: any;
  listIdCampaigns: any;
  value: any;
  ok: any;
  rut: any;
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
  ejecutivos: any;
  quien: any;
  nivel_acceso: any;
  notificaciones: any;
  campaign: any;
  MINUTES = 1;
  top11LeadsByArrayIdSubscribe;
  campaingByEjecSubscribe;
  getUsuariosClaSubscribe;
  headers = null;
  user_cla = null;
  defaultHome = "#"
  @Output() headerEmmiter = new EventEmitter();
  constructor(
    public _firestoreservice: FirestoreService,
    private _route: Router,
    private _auth: AuthService,
    private postgresService: PostgresService
    ) {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.desuscripcionAll();

    this._auth.getestado();
    this.headers = getHeaderStts(this._auth.isUserLoggedIn())

    this.user = this._auth.isUserLoggedIn();
    this.user_cla = this._auth.isUserLoggedInPerfil()


    this.getUsuariosClaSubscribe = this.postgresService.getUsuarioPorMail(this.user.email, this.headers).subscribe(
      resp => {
        if (resp) {
          this.user_cla = resp[0];

          localStorage.setItem('user_perfil', JSON.stringify(resp[0]));
          this.rut = this.user_cla.rut;
          this.nivel_acceso = parseInt(this.user_cla.nivel_acceso);
          if (this.user_cla.id_cargo === "5") {
            this.defaultHome = "/home-tam";
            return;
          }
          this.getTop11LeadsColaborador();
         



        }
      });

    this.loggedIn = (this.user != null);

  }


  getTop11LeadsColaborador() {
    this.postgresServiceSubscription = this.postgresService.getTop11LeadsColaborador(parseInt(this.user_cla.rut), parseInt(this.user_cla.id_cargo), this.headers).subscribe((data: any) => {
      this.notifica = data;
    });

  }

  onLead(id) {
    this.idEmmiter.emit(id);
    this.getTop11LeadsColaborador();
    this._route.navigate(['form-lead', id], { skipLocationChange: true });
  }


  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
  }
  isUserLoggedInPerfil() {
    return JSON.parse(localStorage.getItem('user_perfil'));
  }

  clearSearchInput() {
    this.searchInput.nativeElement.value = '';
  }
  ngOnInit() {
    this.myRadio = "2";

    combineLatest(this.startobs, this.endobs).subscribe((value: any) => {
      if (this.nivel_acceso == 2) {
        this.tipo = 2;
      }
      if (this.nivel_acceso == 3) {
        this.tipo = 3;
      }
      if (this.tipo == 2) {
        this._firestoreservice.searchEmpresa(value[0]).subscribe((resp: any) => {
          this.allemps = resp;
        });
      }
      if (this.tipo == 3) {
        this._firestoreservice.searchAfiliado(value[0]).subscribe((resp: any) => {
          this.allemps = resp;
        });
      }
    });
    this.getGestionPendiente();
    //this.callEveryMinute(this.MINUTES);
  }
  showMessage(type, msg) {
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = "";
    }, 2000);
  }

  logout() {
    this._auth.logout()
      .then(res => {
        this.user = undefined;
        this.loggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');
        localStorage.removeItem('cookieTab');
        this._route.navigate([`/login`]);
      }, err => {
        this.showMessage("danger", err.message);
      });

  }

  onViewAll(){
    localStorage.setItem('cookieTab', 'bell');
    this._route.navigate(['mi-cartera-home'], {skipLocationChange:true});
  }

  public buscarEmpresa(texto: string) {
    if (texto.length == 0) {
      return;
    }

    this._route.navigate(['buscar', texto], { skipLocationChange: true });


  }

  desuscripcionAll() {
    if (this.top11LeadsByArrayIdSubscribe) {
      this.top11LeadsByArrayIdSubscribe.unsubscribe();
    }
    if (this.campaingByEjecSubscribe) {
      this.campaingByEjecSubscribe.unsubscribe();
    }
    if (this.getUsuariosClaSubscribe) {
      this.getUsuariosClaSubscribe.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.subscriptionGestionPendiente) {
      this.subscriptionGestionPendiente.unsubscribe();
    }
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.

    this.desuscripcionAll();

  }

  search($event, form: NgForm) {
    let q = $event.target.value;
    let radio = form.value;
    this.tipo = radio.tipo;
    if (q != '') {
      this.startAt.next(q.toUpperCase());
      this.endAt.next(q.toUpperCase() + "\uf8ff");
    }
    else {
      this.emps = this.allemps;
    }
  }

  onEnter($event) {
    let q = $event.source.value;
    if (this.nivel_acceso == 2) {
      this.tipo = 2;
    }
    if (this.nivel_acceso == 3) {
      this.tipo = 3;
    }


    if (this.tipo == 2) {
      this._route.navigate(['buscar', q], { skipLocationChange: true });
    }
    if (this.tipo == 3) {
      /*this.postgresService.getMicarteraCreditosTotal(this.user_cla.rut, this.user_cla.id_cargo, getHeaderStts(this.user)).subscribe((data: any) => {
        if (data[0].n_total>0){
          this._route.navigate(['mi-ficha',q], {skipLocationChange: true});
        }else{
          this._route.navigate(['buscar_afiliado',q], {skipLocationChange: true});
        }

     });*/
      this._route.navigate(['buscar_afiliado', q], { skipLocationChange: true });

    }



  }
  showLead(id) {

    this._route.navigate(['lead', id], { skipLocationChange: true });


  }



  getGestionPendiente() {
    this.gestionesPendienteAgendada = [];
    this.subscriptionGestionPendiente = this._firestoreservice.getGestionPendiente(this.user.email, 'Volver a llamar').subscribe((snapShot: any) => {
      this.nearAlerts = [];
      snapShot.forEach((snap: any) => {
        this.gestionesPendienteAgendada.push({
          fechaAgendamiento: snap.fechaAgendamiento,
          nombres: snap.nombres,
          rut_persona: snap.rut_persona,
          telefono: snap.telefono,
          comentarios: snap.comentarios,
          fechaContacto: snap.fechContacto,
        })
        let last_date = snap.fechaAgendamiento.toDate()
        if (this.isSameDateButHour(new Date(), last_date)) {
          this.nearAlerts.push(snap);
        }

      })
    })
  }

  isSameDateButHour = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() <= date2.getHours()
  }

  callEveryMinute(minute) {
    let miliseconds = minute * 1000
    setInterval(
      this.handleAlert
      , miliseconds);


  }
  handleAlert() {
    let currentDate = new Date();
    console.log(this.nearAlerts);
    if (typeof this.nearAlerts === 'undefined') {
      return;
    }
    for (let i = 0; i < this.nearAlerts.length; i++) {
      let alerta = this.nearAlerts[i];
      let currentHour = currentDate.getHours()
      let asignementDate = alerta.fechaAgendamiento.toDate();
      if (alerta.estado == 'Contactando' || currentHour < asignementDate.getHours()) {
        continue;
      }

      // validar ventana de minutos
      let minutes = 15;
      if (asignementDate.getHours() === currentHour &&
        this.avalibleMinutesWindow(asignementDate, currentDate, minutes)) {
        Swal.fire({
          title: 'Recordatorio',
          text: `;D Recuerda contactar a ${alerta.nombres} 
          telefono: ${alerta.telefono} 
          email : ${alerta.email}
          `,
          showCancelButton: true,
          type: 'info'
        }).then((result) => {
          // update in firebase
          if (result.value) {
            alerta.estado = 'Contactando';
            this.updateGestion(alerta);
            this._route.navigate(['/mi-ficha', alerta.rut_persona]);
          }
        });
      }
    }
  }

  avalibleMinutesWindow(dateIn: Date, dateForRange: Date, minutes: number) {
    let minutesInMiddle = dateIn.getMinutes();
    let minutesLimit = dateForRange.getMinutes() + minutes > 60 ? 60 : dateForRange.getMinutes() + minutes;
    let initMutes = dateForRange.getMinutes()
    return initMutes <= minutesInMiddle && minutesInMiddle <= minutesLimit;
  }
  updateGestion(document) {
    this._firestoreservice.updateGestionCartera(document.propertyId, document).then(_ => {
      console.log(_)
    }).catch(err => {
      console.log(err);
    })
  }
}



