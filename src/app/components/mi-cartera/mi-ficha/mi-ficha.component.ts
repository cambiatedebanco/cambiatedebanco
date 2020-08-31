import { Component, OnInit, ViewChild, ElementRef , OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { tap } from 'rxjs/operators';
import { getHeaders, getHeaderStts } from '../../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { Subscription } from 'rxjs';
import { CalendarComponent} from 'src/app/components/calendar/calendar.component'
import { FirestoreService } from 'src/app/services/firestore/firestore.service';


@Component({
  selector: 'app-mi-ficha',
  templateUrl: './mi-ficha.component.html',
  styleUrls: ['./mi-ficha.component.css']
})
export class MiFichaComponent implements OnInit, OnDestroy {


  @ViewChild(CalendarComponent, {static: false}) calendarComponet: CalendarComponent;
  user = null;
  headers = null;
  afiliado = null;
  ejecutivo = null;
  afiliadoEmpresa = [];
  afiliado_id = null;
  ofertasPPFF = [];
  ofertasBBSS = [];
  ofertasAlerta = [];
  ofertasPPFFPrimero = null;
  ofertasAlertaPrimero = null;
  timeLineData = [];
  creditosAfiliado = [];
  segurosAfiliado = [];
  ahorroAfiliado = [];
  carouselMarketing = [];
  isSimulador = false;
  showMainContent = false;
  sidebar=false;
  navigationSubscription: Subscription;
  afiliadoSubscription: Subscription;
  getOfertaAfiliadoPpffApiSubscription: Subscription;
  getOfertaAlertaAfiliadoSubscription: Subscription;
  timeLineAfiliadoSubscription: Subscription;
  creditAfiliadoSubscription: Subscription;
  seguroAfiliadoSubscription: Subscription;
  ahorroAfiliadoSubscription: Subscription;
  imagenesSubscription: Subscription;
  getEjecutivoSubscription: Subscription;
  item = null;
  constructor(
    private route: ActivatedRoute,
    private _route: Router,
    private authService: AuthService,
    private postgressService: PostgresService,
    private firestoreservice: FirestoreService
  ) {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites(){

    this.afiliado_id = this.route.snapshot.paramMap.get('id');

    this.authService.getestado();
    this.headers = getHeaderStts(this.authService.isUserLoggedIn());

    this.user =this.authService.isUserLoggedIn();
    this.postgressService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp){
          this.ejecutivo=resp[0];
          this.executeInitialQueries(this.afiliado_id, this.headers);
        }
      });

  }

  ngOnInit() {

  }


  private executeInitialQueries(afiliado_id, headers){
    this.getAfiliado(afiliado_id, headers);
    this.getAfiliadoEmpresa(afiliado_id, headers);
    this.getOfertaAfiliadoPpffApi(afiliado_id, headers);
    this.getOfertaAlertaAfiliado(afiliado_id, headers);
    this.getTimeLineAfiliado(afiliado_id, headers);
    this.getCreditAfiliado(afiliado_id, headers);
    this.getSeguroAfiliado(afiliado_id, headers);
    this.getAhorroAfiliado(afiliado_id, headers);
    this.getImagenComponente('mi_ficha_carousel', 'carouselMarketing', headers);
    this.saveLogFirebase(afiliado_id, this.ejecutivo);
  }

  private saveLogFirebase(rut_afiliado, user){
    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    const dataLog = {
      rut_busqueda: parseInt(rut_afiliado),
      rut_colaborador: parseInt(user.rut),
      email: user.email.toLowerCase(),
      timestamp: parseInt(time.getTime().toString().substr(0, 10)),
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2) + dia.substring(dia.length, dia.length - 2)),
      query: 'afiliado',
      modulo: 'BuscarAfiliadoComponent'
    };

    this.firestoreservice.createLog('cla_scanner_log', dataLog);
  }


  private getAfiliado(id: string, headers) {
    this.afiliadoSubscription = this.postgressService.getAfiliado(id, headers).subscribe((af: any) => {
      this.afiliado = af[0];
      this.getOfertaAfiliadoBBSS(this.afiliado)
    })
  }

  private getAfiliadoEmpresa(id: string, headers) {
    this.afiliadoSubscription = this.postgressService.getAfiliadoEmpresa(id, headers).subscribe((data: any) => {
      this.afiliadoEmpresa = data;

    })
  }
  private getOfertaAfiliadoPpffApi(id: string, headers:object) {
    this.getOfertaAfiliadoPpffApiSubscription = this.postgressService.getOfertaAfiliado(id, headers).subscribe((data: any)=> {
      this.ofertasPPFF = data;
      this.ofertasPPFFPrimero = data[0]
    })
  }


  private getOfertaAfiliadoBBSS(afiliado){
    this.ofertasBBSS = [];
    if(afiliado.es_afiliado === 1){
      //this.ofertasBBSS = ['Cont. Psico', 'Farm. Domicilio']
    }

  }

  private getOfertaAlertaAfiliado(id:string, headers){
    this.getOfertaAlertaAfiliadoSubscription = this.postgressService.getOfertaAlertaAfiliado(
      id, headers).subscribe((data: any) => {
        this.ofertasAlerta = data;
        this.ofertasAlertaPrimero = data[0]
    })
  }


  private getTimeLineAfiliado(id: string, headers){
     this.timeLineAfiliadoSubscription = this.postgressService.getTimeLineAfiliado(
       id, headers).subscribe((data: any) => {
         this.timeLineData = data;
       });
  }
  private getCreditAfiliado(id: string, headers){
    this.creditAfiliadoSubscription = this.postgressService.getCreditoMiFicha(
      id, headers
    ).subscribe((data: any) => {
      this.creditosAfiliado = data;
    })
  }
  private getSeguroAfiliado(id: string, headers){
    this.seguroAfiliadoSubscription = this.postgressService.getSeguroMiFicha(
      id, headers
    ).subscribe((data:any) => {
      this.segurosAfiliado = data;
    });
  }

  private getAhorroAfiliado(id: string, headers){
    this.ahorroAfiliadoSubscription = this.postgressService.getAhorroMiFicha(id, headers
    ).subscribe((data:any) => { this.ahorroAfiliado = data;})
  }

  private getImagenComponente(componente:string, varName:string,headers){
    this.imagenesSubscription = this.postgressService.getImagenesComponente(componente, headers).subscribe(
      (data:any) => {
        this[varName] = data;
      }
    )
  }

  public pushUpdateTimeline(event){
    this.getTimeLineAfiliado(this.afiliado_id, this.headers);
  }
  public toggleSimulador(){
    this.isSimulador = !this.isSimulador;
  }

 public toggleSidebar(){
    this.sidebar = !this.sidebar;
    this.calendarComponet.getEvents();
  }

  public completeSimulation(item:string){
    this.isSimulador = false;
    this.pushUpdateTimeline(null);
    this.item = item;
    //this.fileInput.nativeElement.click();
  }

  ngOnDestroy(){
    this.afiliadoSubscription.unsubscribe();
    this.getOfertaAfiliadoPpffApiSubscription.unsubscribe();
    this.getOfertaAlertaAfiliadoSubscription.unsubscribe();
    this.timeLineAfiliadoSubscription.unsubscribe();
    this.creditAfiliadoSubscription.unsubscribe();
    this.seguroAfiliadoSubscription.unsubscribe();
    this.ahorroAfiliadoSubscription.unsubscribe();
    this.imagenesSubscription.unsubscribe();
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
   }
  }



}
