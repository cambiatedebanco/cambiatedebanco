import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
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
    this.user_cla = JSON.parse(localStorage.getItem('user_perfil'));
    this.user = this._auth.isUserLoggedIn();
    this.getTop11LeadsColaborador();

  }


  getTop11LeadsColaborador() {
    this.postgresServiceSubscription = this.postgresService.getTop11LeadsColaborador(parseInt(this.user_cla.rut), parseInt(this.user_cla.id_cargo), getHeaderStts(this.user)).subscribe((data: any) => {
      this.notifica = data;
    });

  }

  onLead(id) {
    this.idEmmiter.emit(id);
    this.getTop11LeadsColaborador();
    this._route.navigate(['form-lead', id], { skipLocationChange: true });
  }


  ngOnInit() {
    
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
        this._route.navigate([`/`]);
      }, err => {
        this.showMessage("danger", err.message);
      });

  }

  onViewAll(){
    localStorage.setItem('cookieTab', 'bell');
    this._route.navigate(['mi-cartera-home'], {skipLocationChange:true});
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

}