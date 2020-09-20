import { Component, Inject, OnInit ,ViewChild} from '@angular/core';
import { DOCUMENT  } from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';
import { getHeaders, getHeaderStts } from '../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { RutValidator } from '../../rut.validator';
import { of } from 'rxjs';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  format= { add: 'Add', remove: 'Remove', all: 'All', none: 'None', direction: 'left-to-right', draggable: true, locale: undefined }
  formErrors: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  contactoFormGroup: FormGroup;
  isEditable = false;
  keepSorted = true;
  key: string;
  display: any;
  filter = false;
  disabled = false;
  user : any;
  confirmedBanco: Array<any>;
  bancos: any;
  bancos2: any;
  lista:any;
  editable: boolean = true;
  isPaso1_completado = false;
  isPaso2_completado= false;
  isPaso3_completado = false;
  isPaso4_completado = false;
  showForm = true;
   mensajeArchivo = 'No hay un archivo seleccionado';
   nombreArchivo = '';
   URLPublica = '';
   porcentaje = 0;
   finalizado = false;
   datosFormulario = new FormData();

   @ViewChild('stepper', { 'static': false }) stepper: MatStepper;
  constructor(@Inject(DOCUMENT) private document,
  private firebaseStorage: FirebaseStorageService,
  private _formBuilder: FormBuilder,
  private postgresService: PostgresService){ }
  // if user switch from admin to blog need to update theme css.
  ngOnInit() {
    var elem = this.document.getElementById('bootstrap4min');
    elem.setAttribute('href','assets/bootstrap/dist/css/bootstrap.min40.css');
    elem.setAttribute('rel','stylesheet');
    elem.setAttribute('type','text/css');

   

    var elem = this.document.getElementById('theme');
    elem.setAttribute('href','assets/css/style_main.css');
    elem.setAttribute('rel','stylesheet');
    elem.setAttribute('type','text/css');

   
    

  this.postgresService.getBancos().subscribe(resp=>{
    this.bancos=resp;
    this.lista = resp;
    const origen = this.bancos;
 
    this.lista = origen;

    this.display = this.ejecutivosLabel;
    this.key = 'idbanco';
  })






    this.firstFormGroup = this._formBuilder.group({
      bancos: ['', Validators.required],
      deuda: ['', Validators.required],
      archivo:['', Validators.required],
      chkhipoteca:[false],
      chkcredito:[false],
      chktarjeta:[false]
    });

  

    this.secondFormGroup = this._formBuilder.group({
      sBancos: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      rut: ['', [Validators.required, RutValidator.validaRut,Validators.minLength(8)]],
      nombre: ['', [Validators.required,Validators.minLength(3)]],
      telefono: ['',  [Validators.required, Validators.pattern('[0-9]{1,10}')]],
      email: ['', [Validators.email, Validators.required]],
      chktermino: ['', [Validators.required]]
      
    });


    this.contactoFormGroup= this._formBuilder.group({
      nombre:['',[Validators.required]],
      telefono:['',[Validators.required]],
      email:['',[Validators.required]],
      comentarios:['']
    });
    


   
    
  }
 


  private ejecutivosLabel(item: any) {
    return  item.nombre ;
  }

  onSubmitPaso1(stepper: MatStepper) {

    if (this.firstFormGroup.invalid) {
      return;
    }
  //  let archivo = this.datosFormulario.get('archivo');
      //let referencia = this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo);
    //let tarea = this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo);
//    this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo);

let form1= this.firstFormGroup.value;
this.postgresService.getBancos(form1.bancos).subscribe(resp=>{
  this.bancos2=resp;
 
});




    /*if (this.creditFormGroup.invalid) {
      this.isCreditFormCompleted = false;
      this.isDetailCompleted = false;
      return;
    }
    this.isCreditFormCompleted = true;
    this.isDetailCompleted = false;
    const formData = this.creditFormGroup.value;
    this.creditDetail.setSeverance(formData.isSecure === true  ? this.TASACESANTIA/1000  : 0);
    this.afiliado.ES_PENSIONADO = typeof this.afiliado.ES_PENSIONADO === 'undefined' ? 0 : this.afiliado.ES_PENSIONADO;
  
    let creditData = [];
    this.firestoreservice.getSocialCreditData(
      this.convertToUfRange(formData.amount, formData.monthsToDelay), formData.payments, this.afiliado.ES_PENSIONADO).subscribe((data: any) => {
        data.forEach((cr: any) => {
          creditData.push({
            id: cr.payload.doc.id,
            data: cr.payload.doc.data()
          });
          this.creditDetail.setInterestRate((creditData[0].data.TASA_MES))
        });
        // Prepare credit detail
        this.creditDetail.setUf(this.ufData.valor);
        let months = parseInt(formData.monthsToDelay);
        this.creditDetail.setMonths(months);
        this.creditDetail.setAmount(formData.amount);
        this.creditDetail.prepareCalcs();
        this.cuotas=formData.payments;
        this.taxtAmount = this.getTaxValue(this.cuotas, months, formData.amount, this.creditDetail.getProjectedAmount());
        this.initialCapital = this.getInitialCapital(formData.amount, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount(), this.taxtAmount);
        this.payment = this.getPayment(this.creditDetail.getInterestRate(), formData.payments, this.initialCapital);
        this.paymentRate = this.getPaymentRate(this.creditDetail.getInterestRate(), formData.payments, formData.payments, this.initialCapital);
        this.projectionValue = this.getProjection(formData.payment, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount());
        this.monto=formData.amount;
        this.gastoNotarial= this.GASTONOTARIAL;
        this.degravamen = this.afiliado.ES_PENSIONADO > 0 ?  0.86535/1000 : 1.19925/1000;
        this.irrValue = this.getIrr(formData.amount, this.payments, this.creditDetail.getInterestRate(), months);
        this.isDetailCompleted = true;
        stepper.next();
      });*/

  }

  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
        this.nombreArchivo = event.target.files[i].name;
       
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.target.files[i], event.target.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  
  
  onSubmitPaso2(stepper: MatStepper) {
    if (this.secondFormGroup.invalid) {
      return;
    }
    
  
    /*if (this.creditFormGroup.invalid) {
      this.isCreditFormCompleted = false;
      this.isDetailCompleted = false;
      return;
    }
    this.isCreditFormCompleted = true;
    this.isDetailCompleted = false;
    const formData = this.creditFormGroup.value;
    this.creditDetail.setSeverance(formData.isSecure === true  ? this.TASACESANTIA/1000  : 0);
    this.afiliado.ES_PENSIONADO = typeof this.afiliado.ES_PENSIONADO === 'undefined' ? 0 : this.afiliado.ES_PENSIONADO;
  
    let creditData = [];
    this.firestoreservice.getSocialCreditData(
      this.convertToUfRange(formData.amount, formData.monthsToDelay), formData.payments, this.afiliado.ES_PENSIONADO).subscribe((data: any) => {
        data.forEach((cr: any) => {
          creditData.push({
            id: cr.payload.doc.id,
            data: cr.payload.doc.data()
          });
          this.creditDetail.setInterestRate((creditData[0].data.TASA_MES))
        });
        // Prepare credit detail
        this.creditDetail.setUf(this.ufData.valor);
        let months = parseInt(formData.monthsToDelay);
        this.creditDetail.setMonths(months);
        this.creditDetail.setAmount(formData.amount);
        this.creditDetail.prepareCalcs();
        this.cuotas=formData.payments;
        this.taxtAmount = this.getTaxValue(this.cuotas, months, formData.amount, this.creditDetail.getProjectedAmount());
        this.initialCapital = this.getInitialCapital(formData.amount, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount(), this.taxtAmount);
        this.payment = this.getPayment(this.creditDetail.getInterestRate(), formData.payments, this.initialCapital);
        this.paymentRate = this.getPaymentRate(this.creditDetail.getInterestRate(), formData.payments, formData.payments, this.initialCapital);
        this.projectionValue = this.getProjection(formData.payment, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount());
        this.monto=formData.amount;
        this.gastoNotarial= this.GASTONOTARIAL;
        this.degravamen = this.afiliado.ES_PENSIONADO > 0 ?  0.86535/1000 : 1.19925/1000;
        this.irrValue = this.getIrr(formData.amount, this.payments, this.creditDetail.getInterestRate(), months);
        this.isDetailCompleted = true;
        stepper.next();
      });*/

  }

  onSubmitPaso3(stepper: MatStepper) {
    if (this.thirdFormGroup.invalid) {
      return;
    }
    this.stepper.selected.completed = true;
    this.isPaso3_completado = true;
    const time = new Date();
    
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    const fechaString = time.getFullYear() + '-' + mes.substring(mes.length, mes.length - 2)  + '-' + dia.substring(dia.length, dia.length - 2);


    let form1= this.firstFormGroup.value;
    let form2= this.secondFormGroup.value;
    let form3= this.thirdFormGroup.value;
    let timestamp=parseInt(time.getTime().toString().substr(0, 10));
    let extension=this.nombreArchivo.split('.');
    let nombre_archivo= String(timestamp)+ String(form3.rut).replace('-','').replace('.','') + '.' + extension[1];
    let archivo = this.datosFormulario.get('archivo');
    let tarea = this.firebaseStorage.tareaCloudStorage(nombre_archivo, archivo);
 
    const payload={
      idbanco: form1.bancos,
      deuda: form1.deuda,
      hipoteca: form1.chkhipoteca,
      credito: form1.chkcredito,
      tarjeta: form1.chktarjeta,
      bancos: form2.sBancos,
      rut: form3.rut,
      nombre: form3.nombre,
      telefono: form3.telefono,
      email: form3.email,
      timestamp: timestamp,
      archivo:nombre_archivo,
      periodo: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)),
      fecha: parseInt(time.getFullYear() + mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      created_time:  time
   }
  
 this.postgresService.addCotizacion(payload).subscribe(res=>{
  
  let data= res[0];
  this.postgresService.sendEmail(data.nombre,data.id,data.email).subscribe( res=>{
  });
 } 
  );

  this.editable=false;


    /*if (this.creditFormGroup.invalid) {
      this.isCreditFormCompleted = false;
      this.isDetailCompleted = false;
      return;
    }
    this.isCreditFormCompleted = true;
    this.isDetailCompleted = false;
    const formData = this.creditFormGroup.value;
    this.creditDetail.setSeverance(formData.isSecure === true  ? this.TASACESANTIA/1000  : 0);
    this.afiliado.ES_PENSIONADO = typeof this.afiliado.ES_PENSIONADO === 'undefined' ? 0 : this.afiliado.ES_PENSIONADO;
  
    let creditData = [];
    this.firestoreservice.getSocialCreditData(
      this.convertToUfRange(formData.amount, formData.monthsToDelay), formData.payments, this.afiliado.ES_PENSIONADO).subscribe((data: any) => {
        data.forEach((cr: any) => {
          creditData.push({
            id: cr.payload.doc.id,
            data: cr.payload.doc.data()
          });
          this.creditDetail.setInterestRate((creditData[0].data.TASA_MES))
        });
        // Prepare credit detail
        this.creditDetail.setUf(this.ufData.valor);
        let months = parseInt(formData.monthsToDelay);
        this.creditDetail.setMonths(months);
        this.creditDetail.setAmount(formData.amount);
        this.creditDetail.prepareCalcs();
        this.cuotas=formData.payments;
        this.taxtAmount = this.getTaxValue(this.cuotas, months, formData.amount, this.creditDetail.getProjectedAmount());
        this.initialCapital = this.getInitialCapital(formData.amount, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount(), this.taxtAmount);
        this.payment = this.getPayment(this.creditDetail.getInterestRate(), formData.payments, this.initialCapital);
        this.paymentRate = this.getPaymentRate(this.creditDetail.getInterestRate(), formData.payments, formData.payments, this.initialCapital);
        this.projectionValue = this.getProjection(formData.payment, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount());
        this.monto=formData.amount;
        this.gastoNotarial= this.GASTONOTARIAL;
        this.degravamen = this.afiliado.ES_PENSIONADO > 0 ?  0.86535/1000 : 1.19925/1000;
        this.irrValue = this.getIrr(formData.amount, this.payments, this.creditDetail.getInterestRate(), months);
        this.isDetailCompleted = true;
        stepper.next();
      });*/

  }

  onSubmitContacto(){

    if (this.contactoFormGroup.invalid) {
      return;
    }

 let contacto= this.contactoFormGroup.value;


  this.postgresService.sendEmail_contacto(contacto.nombre,contacto.telefono,contacto.email,contacto.comentarios).subscribe( res=>{
    this.showForm = false;
  });
  


  }


}
