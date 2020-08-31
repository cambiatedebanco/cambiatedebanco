import { Component, OnInit, Input, Output, EventEmitter,NgModule } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { getHeaders } from '../../utility';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-cartera-gestion',
  templateUrl: './cartera-gestion.component.html',
  styleUrls: ['./cartera-gestion.component.css']
})
export class CarteraGestionComponent implements OnInit {

  authSuscription: Subscription;
  estadoSubscription: Subscription;
  navigationSubscription: Subscription;
  _ejecutivo = null;
  @Input() rut;


  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }


  carteraEstado = false;
  get afiliado(){
    return this._afiliado;
  }
  @Output() completeGestion = new EventEmitter<boolean>();
  _afiliado: any;
  testFromGroup: FormGroup;
  estados = [
    'No Califica', 'Formaliza',
    'Acepta', 'No Acepta',
    'Otro', 'Lo Pensara', 'Volver a llamar'
  ]
  estado = null;
  submitted = null;
  user = null;
  headers = null;
  cambioEstado;
  minutes:any[]= [0, 15, 30, 45];
  hours:any[] = [];
  meridianos:string[] = ['AM', 'PM']
  now = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private postgresService: PostgresService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private _route: Router,
    ) {
      this.navigationSubscription = this._route.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
     }
  ngOnInit() {

    this.testFromGroup = this.formBuilder.group({
      rut: new FormControl({value: '', disabled:true},  [Validators.required]),
      nombres: new FormControl({value: '', disabled: false}, [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      comentarios: new FormControl({value: ''}),
      email: new FormControl(null,[Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      fechaAgendamiento: new FormControl(this.now),
      horaAgendamiento: new FormControl()
    });

  }

  initialiseInvites(){
    
    let afiliado_id = this.route.snapshot.paramMap.get('id');
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user } })
    ).subscribe(_ => {
      let headers = this.headers = getHeaders(this.user);
      this.executeInitialQueries(afiliado_id, headers);
    })
  }

  ngOnDestroy(){
    this.authSuscription.unsubscribe();
    this.estadoSubscription.unsubscribe();
    this.afiliadoSubscription.unsubscribe();
  }

  prepareTestForm(){
    let email = this.getValueOrNull(this._afiliado.correo_elect_persona);
    let telefono = this.getValueOrNull(this._afiliado.fono_movil);
    this.testFromGroup = this.formBuilder.group({
      rut: new FormControl({value: this._afiliado.rut_persona, disabled:true},  [Validators.required]),
      nombres: new FormControl({value: this._afiliado.nombres, disabled:true},  [Validators.required]),
      estado: new FormControl(null, [Validators.required]),
      email: new FormControl(email,[Validators.required]),
      telefono: new FormControl(telefono, [Validators.required, Validators.pattern('[0-9]{1,10}')]),
      comentarios: new FormControl(null),
      fechaAgendamiento: new FormControl(this.now),
      horaAgendamiento: new FormControl()
    });

    this.estadoSubscription = this.testFromGroup.get('estado').valueChanges.subscribe(value=> {
      if(value == this.estados[-1]){
        this.testFromGroup.setControl('fechaAgendamiento', new FormControl(this.now, [Validators.required]))
        this.testFromGroup.setControl('horaAgendamiento', new FormControl(null, [Validators.required]))
        return;
      }
      this.testFromGroup.setControl('fechaAgendamiento', new FormControl(this.now));
      this.testFromGroup.setControl('horaAgendamiento', new FormControl(null));
    })
  }

  onSubmit(){
    if(this.testFromGroup.invalid){
      return;
    }
    let formData = this.testFromGroup.value;
    formData.rut_persona = this._afiliado.rut_persona;
    formData.nombres = this._afiliado.nombres;
    formData.ejecutivo = this.user.email;
    formData.fechaContacto = new Date()
    formData.id_operador = this._ejecutivo.RUT,
    formData.canal = 'CEO'
    if(formData.fechaAgendamiento != ''){
      this.insertEventCalendar(formData);
    }
    this.saveTimeline(formData)
  }


  private insertEventCalendar(formData: any) {
    let description = `Contactar afiliado ${formData.nombres} al numero ${formData.telefono}, rut ${formData.rut_persona}. Comentarios : ${
      formData.comentarios
    }`;

    let horaFechaArray = formData.horaAgendamiento.split(":");
    let minutoMerdiano = horaFechaArray[1].split(" ");
    let meridiano = minutoMerdiano[1];
    let minutos = parseInt(minutoMerdiano);
    let hora =  parseInt(horaFechaArray[0]);
    let fecha = new Date(formData.fechaAgendamiento);
    hora = this.get24Hours(meridiano, hora)
    fecha.setHours(hora);
    fecha.setMinutes(minutos);
    
    
    let url = `http://localhost:4200/#/mi-ficha/${formData.rut_persona}`;

    this.authService.insertEvents(description, fecha.toISOString(), formData.estado, url, formData.email);
  }

  get24Hours(meridiano, hora)
  {
    return meridiano === this.meridianos[0] ? hora : hora + 12;
  }

  saveTimeline(formData){
    this.postgresService.saveTimeLine(formData, this.headers).subscribe(res => console.log(res),
    err => {
      console.error(err)
    },
    ()=> {
      this.sendCompleteForm();
    }
  )
  }

  saveLog(collection:string, data:any){
    this.firestoreService.createLog(collection, data);
  }

  getValueOrNull(param){
    return typeof param === 'undefined'
           ? null
           : param
  }

  prepareHeaders(){

    this.authSuscription =  this.authService.isUserLoggedInAuth().pipe(
      tap((user)=> {if (user){ this.user =user}})
     ).subscribe(_ => {
       this.headers = getHeaders(this.user);
     })
  }

  sendCompleteForm(){
    this.testFromGroup.setControl('comentarios',new FormControl(null))
    this.testFromGroup.setControl('estado', new FormControl(null, [Validators.required]))
    this.completeGestion.emit(true);
  }

  executeInitialQueries(afiliado_id: string, headers){
    this.getAfiliado(afiliado_id, headers);
  }
  afiliadoSubscription: Subscription;
  private getAfiliado(id: string, headers){
    this.afiliadoSubscription = this.postgresService.getAfiliado(id, headers).subscribe((snap: any) => {
      this._afiliado = snap[0];
      this.prepareTestForm();
    })
  }
}
