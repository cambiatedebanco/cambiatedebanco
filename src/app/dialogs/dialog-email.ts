import { Component, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SendEmailService } from '../services/gmail/send-email.service';
import { numberFormat } from 'highcharts';
import { EmailDialogInterface } from '../interface/emailDialogInterface';
import { capitalizeFirstLetter } from '../components/utility';

@Component({
    selector: 'dialog-email',
    templateUrl: 'dialog-email.html',
  })
  export class DialogEmail {
  
    public Editor = ClassicEditor;
    public config = {
      language: 'es',
      placeholder: 'Escriba su mensaje aquí!',
      toolbar: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
    };
  
  
    constructor(public dialogRef: MatDialogRef<DialogEmail>,
      @Inject(MAT_DIALOG_DATA) public data: EmailDialogInterface,
      public formBuilder: FormBuilder,
      private sendEmailService: SendEmailService) {
  
    }
    sendEmailGroup = this.formBuilder.group({
      email: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      conCopia: new FormControl(null)
    });
  
  
    ngOnInit() {
      let message = this.prepareMessage()
      let subject = this.getSubject(this.data.afiliado)

      this.sendEmailGroup = this.formBuilder.group({
        email: new FormControl(this.data.to, [Validators.required, Validators.email]),
        subject: new FormControl(subject, [Validators.required]),
        message: new FormControl(message, [Validators.required]),
        conCopia: new FormControl(this.data.from.toLowerCase(), [Validators.required, Validators.email])
      });
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

    getNombreEjecutivo(ejecutivo){
      // Capitalizan y retorna nombre del ejecutivo
     return capitalizeFirstLetter(ejecutivo.nombres.split(' ')[0] + ' ' + ejecutivo.apellido_paterno);
   }
  

    getNombreAfiliado(afiliado){
      // Capitalizan y retorna nombre del afiliado
      return capitalizeFirstLetter((afiliado.nombres).toString().replace((afiliado.apellido_paterno).toString() + ' '+ (afiliado.apellido_materno).toString(),"").trim().split(' ')[0] + ' ' + afiliado.apellido_paterno);
    
    }
    
    getSubject(afiliado) {
      let subject = '';
      subject += `Hola ${this.getNombreAfiliado(afiliado)}, tienes un Crédito Social Pre aprobado!`
      return subject;
    }

    prepareMessage() {
      const estimado = this.data.afiliado.sexo_persona === 'M' ? 'Estimado' : 'Estimada';
      let message = ''
      let nombreEjecutivo = this.getNombreEjecutivo(this.data.ejecutivo)

      let monto =  numberFormat(this.data.oferta.monto, 0, ',', '.');
      message += `
        ${estimado} ${this.getNombreAfiliado(this.data.afiliado)}
        <p>&nbsp;</p>
  
        Mi nombre es ${nombreEjecutivo},  y me comunico con usted para contarle que este mes cuenta con un Crédito Social Pre Aprobado de $ ${monto}.
        <p>&nbsp;</p>
        En caso de consulta, no dude en comunicarse conmigo a  ${this.data.ejecutivo.email.toLowerCase()}.
        <p>&nbsp;</p>
        Quedo atento a tu respuesta,
  
        <p>&nbsp;</p>
        <div style="vertical-align:top;padding:5px 5px 5px 10px,font-family:arial;font-size:14px ">
        <strong style="font-size:1.2em;display:block;margin-bottom:3px;color:#009fe3">${nombreEjecutivo}</strong>
        <p style="font-size:0.9em;margin:0;color:#737373">
          <strong>${this.data.ejecutivo.puesto_real}</strong><br>
          <strong>${this.data.ejecutivo.email.toLowerCase()}</strong><br>
        </p>
  
        
        <p style="font-size:0.9em;margin:0;color:#009fe3"> 
          <br>
        <img alt="" src="https://lh3.googleusercontent.com/92bWC77JEg-9oif6HZXZwqh_Pz5qAY2B3KWXd-ROrZCHUGRgVfJF-MM0hx_NKiBcCcSjXzHTynmeqsos_YZPPVdJBMEdUIkJbTD74g" style="width:240px;height:113px" class="CToWUd a6T" tabindex="0">
        </p>
  
        *Crédito sujeto a evaluación de antecedentes.
        Las Cajas de Compensación son fiscalizadas por la Superintendencia de Seguridad Social (www.suseso.cl)
      Este correo electrónico se ha enviado a ${this.data.afiliado.correo_elect_persona} , si no desea seguir recibiendo esta información puede cancelar la suscripción  
        </div>
   
  `;
      return message
    }
  
    confirmSelect() {
      console.log('check!')
      if (this.sendEmailGroup.invalid) {
        return;
      }
      let formData = this.sendEmailGroup.value;
      const sender = this.data.ejecutivo.email.toLowerCase();
      const cc = formData.conCopia.toLowerCase() || '';
      const receiver = formData.email;
      const subject = formData.subject;
      const message = formData.message;
      this.sendEmailService.prepareEmail(sender, receiver, cc, subject, message);
      this.dialogRef.close(true);
    }
  }