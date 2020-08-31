import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { SendEmailService } from 'src/app/services/gmail/send-email.service';
import { templateMailingDiferimiento } from './encuesta-template';

@Component({
  selector: 'app-mi-ficha-encuesta',
  templateUrl: './mi-ficha-encuesta.component.html',
  styleUrls: ['./mi-ficha-encuesta.component.css']
})
export class MiFichaEncuestaComponent implements OnInit {
  _afiliado = null;
  _ejecutivo = null;
  @Input() set afiliado(afiliado) {
    this._afiliado = afiliado;
  }
  get afiliado() {
    return this._afiliado;
  }

  @Input() set ejecutivo(ejecutivo) {
    this._ejecutivo = ejecutivo;
  }
  get ejecutivo(){
    return this._ejecutivo;
  }

  constructor(private sendEmailService: SendEmailService) { }
  date = new Date();
  dummySurvey = {
    label: 'SATISFACCIÓN DEL AFILIADO CON LA CAJA',
    surveyDate: this.date.setDate(this.date.getDate() - 1)
  }

  ngOnInit() {
  }

  askSurvey() {
    // TODO REPLACE MAIL correo_elect_persona
    Swal.fire({
      title: `¿Estas seguro de enviar la encuesta a ${this._afiliado.nombres}?`,
      input: 'text',
      inputValue: this._ejecutivo.EMAIL,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar encuesta!',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {

        return this.prepareAndSubmitEmail(email);
        // return fetch(`//api.github.com/users/${email}`)
        //   .then(response => {
        //     if (!response.ok) {
        //       throw new Error(response.statusText)
        //     }
        //     return response.json()
        //   })
        //   .catch(error => {
        //     Swal.showValidationMessage(
        //       `Request failed: ${error}`
        //     )
        //   })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
       console.log(result);
      }
    })
  }
  prepareAndSubmitEmail(receiver){
    let subject = 'Danos tu opinión sobre tu experiencia con nosotros';
    let cc = '';
    let message = this.getMessageBody(receiver);
    let sender = this._ejecutivo.EMAIL.toLowerCase();
    return this.submitEmail(sender, receiver, cc, subject, message);
  }

  submitEmail(sender, receiver, cc, subject, message){
    return this.sendEmailService.prepareEmail(sender, receiver, cc, subject, message)
  }

  reverseDateFormat = (date) => {
    // 01/04/2020 --> [01,04,2020] --->20200401
    if(typeof date === 'undefined'){
        return date
    }
    var today = new Date(date)
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    let month = '';
    let day = '';
    if (mm < 10) {
        month = '0' + mm;
    }
    if(dd<10){
        day = '0'+ dd;
    }
    return String(yyyy + month +  day);
    
}
  getMessageBody(email){
    let contact_mail = 'contacto@infoceocrm.cajalosandes.cl'
    let unsubscribe_url = "https://ceocrm.cajalosandes.cl/#/desuscribir/"
    let temp_unsubscribe_url  = unsubscribe_url + email;
    let date = this.reverseDateFormat(new Date());
    let url_encuesta = `https://ceocrm.cajalosandes.cl/#/encuesta_diferidos/1/${this.afiliado.rut_persona}/${date}`
    return templateMailingDiferimiento(url_encuesta, contact_mail, email,temp_unsubscribe_url);
  }

}

