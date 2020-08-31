import { Component, OnInit, Input, SimpleChanges, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { SendEmailService } from 'src/app/services/gmail/send-email.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { AuthService } from 'src/app/services/auth.service';
import { getHeaders, capitalizeFirstLetter } from '../utility';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnDestroy {
  @Output() completeGestion = new EventEmitter<boolean>();
  @ViewChild('closebuttonEmail', null) closebuttonEmail;
  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo() {
    return this._ejecutivo;
  }
  _ejecutivo: any;

  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
  }
  get afiliado() {
    return this._afiliado;
  }
  _afiliado: any;

  @Input() set item(item) {
    this._item = item;

  }
  get item() {
    return this._item;
  }
  _item: any;

  public Editor = ClassicEditor;
  sendEmailGroup: FormGroup;
  initMessage: any;
  navigationSubscription: Subscription;
  user = null;
  headers: any;

  public config = {
    language: 'es',
    placeholder: 'Escriba su mensaje aquí!',
    toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']};

  constructor(
    private sendEmailService: SendEmailService,
    private formBuilder: FormBuilder,
    private router: Router,
    private postgresService: PostgresService,
    private authService: AuthService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
    }

    initialiseInvites() {
    this.sendEmailGroup = this.formBuilder.group({
      email: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      conCopia: new FormControl(null)
    });

  }  

  ngOnInit() {
    this.authService.isUserLoggedInAuth().pipe(
      tap((user) => { if (user) { this.user = user;
                                  this.headers = getHeaders(user);} })
    ).subscribe(
      _ => {
      }
    );
  }

  capitalizeFirstLetter(word: any){
     return word.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }


  onSubmitEmail() {
    if (this.sendEmailGroup.invalid) {
      return;
    }
    const formData = this.sendEmailGroup.value;

    const sender      = this._ejecutivo.email.toLowerCase();
    const cc          = formData.conCopia || '';
    const receiver    = formData.email;
    const subject     = formData.subject;
    const message     = formData.message;

    this.sendEmailService.prepareEmail(sender, receiver, cc, subject, message);
    let dataTimeline = {
      rut_persona: this._afiliado.rut_persona,
      ejecutivo : this._ejecutivo.email.toLowerCase(),
      id_operador : this._ejecutivo.rut,
      canal : 'CEO',
      tipo_gestion : this._item.tipo_producto + ' ' + this._item.alerta || this._item.oferta,
      comentarios : 'Se envía mail al afiliado acerca de ' + this._item.tipo_producto + ' ' + this._item.alerta || this._item.oferta,
      fechaContacto : new Date(),
      tipo_interaccion : 'Atiende Ejecutivo',
      campana : '',
      estado_gestion : 'Informado'
   };

    Swal.fire({
      title: 'OK',
      text: 'Correo enviado correctamente',
      type: 'success'
    }).then( function() {

    });

    this.closebuttonEmail.nativeElement.click();

    this.postgresService.saveTimeLine(dataTimeline, this.headers).subscribe(res => console.log(res), 
    err => {
        console.log(err);
    },
    () => {
      console.log('complete');
      this.completeGestion.emit(true);
      });

  }



  ngOnChanges(changes: SimpleChanges) {

    if (typeof changes.item !== 'undefined') {

        if (this.afiliado && this.ejecutivo && changes.item.currentValue !== 'undefined') {

          let message = '';
          const estimado = this.afiliado.sexo_persona === 'M' ? 'Estimado' : 'Estimada';
          const nombreAfiliado = this.getNombreAfiliado()
          const nombreEjecutivo = this.getNombreEjecutivo();

          if(changes.item.currentValue.tipo_producto == 'Simulación Credito Social'){
            message = this.prepareCreditMessage(changes.item.currentValue, message);
          }else {
            message +=   `<p>${estimado} ${nombreAfiliado}</p><p>&nbsp;</p>`;
            message +=   `${changes.item.currentValue.script}<p>&nbsp;</p>`;
            message +=   `<p>Atte.</p><p>&nbsp;</p>`;
          }

          message += `<p>&nbsp;</p>`;
          message +=   `
            
                <div style="vertical-align:top;padding:5px 5px 5px 10px,font-family:arial;font-size:14px ">
                <strong style="font-size:1.2em;display:block;margin-bottom:3px;color:#009fe3">${nombreEjecutivo}  $</strong>
                <p style="font-size:0.9em;margin:0;color:#737373">
                  <strong>${this.ejecutivo.puesto_real}</strong><br>
                  <strong>${this.ejecutivo.email.toLowerCase()}</strong><br>
                </p>
          
                <p style="font-size:0.9em;margin:0;color:#009fe3"> 
                  <strong>General Calderón 121, Providencia, Santiago     </strong><br>

                <img alt="" src="https://lh3.googleusercontent.com/92bWC77JEg-9oif6HZXZwqh_Pz5qAY2B3KWXd-ROrZCHUGRgVfJF-MM0hx_NKiBcCcSjXzHTynmeqsos_YZPPVdJBMEdUIkJbTD74g" style="width:240px;height:113px" class="CToWUd a6T" tabindex="0">
                </p>
                </div>
           
          
          `;
          this.sendEmailGroup.controls.message.setValue(message);
          this.sendEmailGroup.controls.email.setValue(this.ejecutivo.email.toLowerCase());
          this.sendEmailGroup.controls.subject.setValue(`${changes.item.currentValue.tipo_producto} ${changes.item.currentValue.alerta}`);

      }
      }
  }

  getNombreAfiliado(){
    // Capitalizan y retorna nombre del afiliado
    return capitalizeFirstLetter((this.afiliado.nombres).toString().replace((this.afiliado.apellido_paterno).toString() + ' '+ (this.afiliado.apellido_materno).toString(),"").trim());
  }
  getNombreEjecutivo(){
     // Capitalizan y retorna nombre del ejecutivo
    return capitalizeFirstLetter(this.ejecutivo.nombres + ' ' + this.ejecutivo.apellido_paterno + ' ' + this.ejecutivo.apellido_materno);
  }


  prepareCreditMessage(itemValue, message){
    // TO DO : executive genre 
    var fecha = new Date
    var grettings = fecha.getHours() >= 12 ? 'Buenas tardes' : 'Buen día ';
    message += `${grettings} ${this.getNombreAfiliado()}`
    message += `<p>&nbsp;</p>`
    message += `Mi nombre es ${this.getNombreEjecutivo()}, ejecutivo de Caja Los Andes, y tengo una muy buena oferta `
    message += `${itemValue.script}`
    message += `<p>&nbsp;</p>`
    return message;
  
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
    this.closebuttonEmail.nativeElement.click();
  }


}
