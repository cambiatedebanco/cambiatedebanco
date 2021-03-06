import { Component, OnInit,ViewChild, Input,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, CheckboxControlValueAccessor } from '@angular/forms';

import { PostgresService } from '../../../services/postgres/postgres.service';
import { AuthService } from '../../../services/auth.service';
import {getHeaders} from '../../utility';
import { tap } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { MatStepper } from '@angular/material/stepper';
import { saveAs } from 'file-saver';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Finance } from 'financejs';

import { FunctionsService } from 'src/app/services/functions.service';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

import { CreditDetail } from 'src/app/classes/creditDetail.class';
import { RutValidator } from '../../../rut.validator';


@Component({
  selector: 'app-cartera-ficha-afiliado',
  templateUrl: './cartera-ficha-afiliado.component.html',
  styleUrls: ['./cartera-ficha-afiliado.component.css']
})
export class CarteraFichaAfiliadoComponent implements OnInit, OnDestroy   {
  navigationSubscription;
  afiliado: any;
  aprobado: any;
  afiliado2: any;
  aprobado2: any;
  rutFormGroup: FormGroup;
  creditFormGroup: FormGroup;
  contactForm: FormGroup;
  creditDetail: CreditDetail;
  // complete
  isCreditFormCompleted = false;
  isDetailCompleted = false;
  isQueryReady = false;



  isAfiliado = true;
  isOffers = false;
  offert = null;

  ufData = {valor: null, fecha: null};
  monthsToDelay = [1, 2];
  // REFACTOR
  GASTONOTARIAL = 700;
  TASACESANTIA = 2.16216;
  interestRate = null;
  projectedDays = null;
  taxtAmount = null;
  initialCapital = null;
  payment = null;
  paymentRate = null;
  tasaCesantia  = null;
  degravamen = 0;
  projectionValue = 0;
  cuotas=0;
  totalCuota = 0;
  monto=0;
  irrValue = 0;
  gastoNotarial = 0;
  payments = []
  private user: any;
  private headers: any;
  rut: any;
  @Input() id: any;
  @ViewChild('stepper',{'static':false}) stepper: MatStepper;

  constructor(
     private _route: Router,
     private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private functionsServices:FunctionsService,
    private authService: AuthService,
    private postgresService: PostgresService,
    private firestoreservice:FirestoreService) {

    this.user = this.authService.isUserLoggedIn();
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    registerLocaleData( es );
    const id = this.route.snapshot.paramMap.get('id');
this.rut = id;
    this.authService.isUserLoggedInAuth().pipe(
    tap((user) => {if (user) {this.user = user; }})
  ).subscribe(
    // igual se puede validar que este el usuario aqui
   _ => {
    // consultas postgress que deban ser ejecutadas al momento de crear el componente
    const headers = this.headers = getHeaders(this.user);
    this.postgresService.getAfiliado(id , headers).subscribe((afiliado: any) => {
      this.afiliado2 = afiliado[0];
    });
    this.postgresService.getAfiliadoAprobadoPrecalificado(id , headers).subscribe((aprobado: any) => {
      this.aprobado2 = aprobado[0];
    });


    this.creditDetail = new CreditDetail();
    let tempRut = String(id) != '' ? String(id)+'-'+this.getDv(String(id)) : '';
    this.rutFormGroup = this.formBuilder.group({
      rut: new FormControl(tempRut, [Validators.required, RutValidator.validaRut])
    });
    this.creditFormGroup = this.formBuilder.group({
      amount: new FormControl({value: 1}, Validators.required),
      payments: new FormControl({value: 1}, [Validators.required, Validators.min(1)]),
      monthsToDelay: new FormControl({value: 1}, [Validators.required]),
      isSecure: new FormControl()
    });
    this.contactForm = this.formBuilder.group({
      nombres: new FormControl({value: '', disabled: true}, [Validators.required]),
      email: new FormControl({value: 'dummy@dummy.cl'}, [Validators.email, Validators.required]),
      rut: new FormControl({value: '', disabled: true}, [Validators.required]),
      telefono: new FormControl({value: 0}, [Validators.required, Validators.pattern('[0-9]{1,10}')])
    });
    this.prepareUf();
   }
  );
  }





  ngOnInit() {
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  openDiv(){

  }

  prepareUf() {
    this.firestoreservice.getUf(this.getCurretDate()).subscribe((ufSnap: any) => {
      ufSnap.forEach((uf: any) => {
        this.ufData.valor = parseFloat(uf.payload.doc.data().UF);
        this.ufData.fecha = uf.payload.doc.data().FECHA;
      });
    });
  }

getCurretDate(): string {
    // TO DO: Funcion podria estar en un common
    const time = new Date();
    const mes = '0' + (time.getMonth() + 1).toString();
    const dia = '0' + (time.getDate()).toString();
    const fechaString = time.getFullYear() + '-' + mes.substring(
      mes.length, mes.length - 2)  + '-' + dia.substring(dia.length, dia.length - 2);
    return fechaString;
  }

onSubmitRutFormGroup(stepper: MatStepper) {
    this.isAfiliado = true;
    if (this.rutFormGroup.invalid) {
      return;
    }
    let rut = this.rutFormGroup.value.rut;
    rut = String(rut).replace('.','').substring(0,String(rut).replace('.','').length-2);
    this.getAfiliado_cla(rut, stepper);
  }

onSubmitContactForm(stepper) {
    if (this.contactForm.invalid) {
      return;
    }
    const creditData = this.creditFormGroup.value;
    const contactData = this.contactForm.value;
    const payload = {
      RUT: this.afiliado.RUT_PERSONA,
      DV: this.afiliado.DV_RUT_PERSONA || '',
      NOMBRES: this.afiliado.NOMBRES,
      EMAIL: contactData.email.toLowerCase(),
      TELEFONO: contactData.telefono,
      MONTO_SOLICITADO: creditData.amount,
      CUOTAS: creditData.payments,
      MESES_GRACIA: creditData.monthsToDelay[0] || 1,
      UF: this.creditDetail.getUf(),
      TASA_INTERES: this.creditDetail.getInterestRate(),
      MONTO_PROYECTADO: this.creditDetail.getProjectedAmount(),
      CAPITAL_INITIAL: this.initialCapital,
    };
    this.firestoreservice.createSimulation(payload).then(()=>{
      Swal.fire({
        title: '<b>Simulación Enviada</b>',
        text:'Esta simulación fue enviada a ' + this.afiliado.NOMBRES  +  ' al correo ' + contactData.email.toLowerCase(),
        type: 'success'
    })
    this.hardResetForms();
    stepper.selectedIndex = 0;
    }).catch((err)=>{
      Swal.fire({
        title: 'Ops!',
        text:'Algo salio mal.',
        type: 'error'
    })
    });

  }

hardResetForms(){
  this.rutFormGroup.reset({rut:{value:'', disabled:false}})
  this.creditFormGroup.reset(
    {
      amount:{value:1,},
      payments:{value:1},
      monthsToDelay:{value: 1},
      isSecure:{value:true}
    })
  this.contactForm.reset()
}
onClickDetail(stepper: MatStepper){
  this.isDetailCompleted = true;
 stepper.next();
}

getAfiliado_cla(rut: string, stepper) {
    this.afiliado = false;
    this.isQueryReady = false;
    Swal.queue([{
      title: 'Un segundo...',
      onOpen: () => {
        Swal.showLoading()
        this.firestoreservice.getAfiliado_cla(rut).subscribe((afiliadoDoc: any) => {
          if (!afiliadoDoc.payload.exists) {
            this.isAfiliado = false;
            this.isQueryReady = true;
            this.rutFormGroup.controls.rut.setErrors({incorrect: true});
            Swal.hideLoading();
            Swal.close();
            return;
          }
          this.afiliado = afiliadoDoc.payload.data();
          this.getAfiliados_cla_ofertas_aprobados(rut);
          this.isAfiliado = true;
          Swal.hideLoading();
          Swal.close();
          stepper.next();
        });
      }
    }])

  }
getAfiliados_cla_ofertas_aprobados(rut: string) {
    // postgres...
    this.postgresService.getAfiliadoAprobadoPrecalificado(rut, this.headers).subscribe((data: any)=>{
      this.isOffers = data.length > 0;
      this.isQueryReady = true;
      const ofertaAprobPrecal = [];
      data.forEach((oferta: any) => {
        ofertaAprobPrecal.push(
        oferta
        );
      });
      if(!this.isOffers){
        this.creditFormGroup.controls.amount.setErrors({incorrect: true});
        Swal.hideLoading();
        Swal.close();
        return false;
      }
      this.offert = ofertaAprobPrecal[0];
      this.resetCreditFormAmount();
      this.resetContactForm();
    })
  }

resetCreditFormAmount() {
    this.creditFormGroup.controls.amount.clearValidators();
    this.creditFormGroup.controls.amount.setValidators(
      [Validators.max(this.offert.monto), Validators.min(1), Validators.required]);
    this.creditFormGroup.controls.amount.setValue(this.offert.monto);
    this.creditFormGroup.controls.payments.setValue(3);
    this.creditFormGroup.controls.monthsToDelay.setValue(1);
    this.isCreditFormCompleted = false;
  }
resetContactForm() {
    this.contactForm.controls.rut.setValue(this.offert.rut_persona);
    this.contactForm.controls.email.setValue(this.afiliado.CORREO_ELECT_PERSONA);
    this.contactForm.controls.telefono.setValue(this.afiliado.TELEFONO || '');
    this.contactForm.controls.rut.setValue(this.afiliado.RUT_PERSONA);
    this.contactForm.controls.nombres.setValue(this.afiliado.NOMBRES);
  }

onSubmitCreditFormGroup(stepper) {
    if (this.creditFormGroup.invalid) {
      this.isCreditFormCompleted = false;
      this.isDetailCompleted = false;
      return;
    }
    this.isCreditFormCompleted = true;
    this.isDetailCompleted = false;
    const formData = this.creditFormGroup.value;
    this.creditDetail.setSeverance(formData.isSecure === true  ? this.TASACESANTIA/1000  : 0);
    this.afiliado.ES_PENSIONADO = typeof this.afiliado.ES_PENSIONADO === 'undefined' ? 0 : this.afiliado.ES_PENSIONADO;
    // Forzar rango
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
        let monto = parseInt(formData.amount);
        this.creditDetail.setUf(this.ufData.valor);
        let months = parseInt(formData.monthsToDelay);
        this.creditDetail.setMonths(months);
        this.creditDetail.setAmount(monto);
        this.creditDetail.prepareCalcs();
        this.cuotas=formData.payments;
        this.taxtAmount = this.getTaxValue(this.cuotas, months, monto, this.creditDetail.getProjectedAmount());
        this.initialCapital = this.getInitialCapital(monto, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount(), this.taxtAmount);
        this.payment = this.getPayment(this.creditDetail.getInterestRate(), formData.payments, this.initialCapital);
        this.paymentRate = this.getPaymentRate(this.creditDetail.getInterestRate(), formData.payments, formData.payments, this.initialCapital);
        this.projectionValue = this.getProjection(formData.payment, this.creditDetail.getProjectedDays(), this.creditDetail.getProjectedAmount());
        this.monto=formData.amount;
        this.gastoNotarial= this.GASTONOTARIAL;
        this.degravamen = this.afiliado.ES_PENSIONADO > 0 ? 0.86535/1000 : 1.19925/1000;


        this.irrValue = this.getIrr(monto, this.payments, this.creditDetail.getInterestRate(), months);
        this.isDetailCompleted = true;
        stepper.next();
      });

  }

  convertToUfRange(amount: number, graceMonth): number {
      // CONVIERTE A UF Y LUEGO EVALUA EL RANGO
      let ufAmount =  amount / this.ufData.valor;
      switch (true) {
        case ((ufAmount <= 50)):
          ufAmount = 50;
          break;
        case((ufAmount > 50 && ufAmount <= 200)):
          ufAmount = 200;
          break;
        case((ufAmount > 200 && ufAmount <= 5000)):
          ufAmount = 5000;
          break;
      }
      return ufAmount;
  }

  getTaxValue(payments: number, graceMonths: number, amount: number, projectedAmount: any) {
    const percent = 0.00066;
    const fechaOtorgada = new Date();
    const currentYear = fechaOtorgada.getFullYear();
    const currentMonth = fechaOtorgada.getMonth();
    const fechaVencimiento = new Date(currentYear, currentMonth + graceMonths, 0);
    const isFechaOtorgada = fechaOtorgada.getDate() >= fechaVencimiento.getDate() ? 0 : 1;
    // check parse
    const a  = payments + graceMonths + isFechaOtorgada;
    const n1 = a * percent;
    const c3 = Math.min(n1, 0.008);
    const div = 1 - c3;
    const suma = amount + projectedAmount + this.GASTONOTARIAL;
    return  c3 * suma / div;
  }

  getInitialCapital(amount: number, projectedDays: number, projectedAmount: number, tax: number) {
    const projectionValue = projectedDays >= 30 ? projectedAmount : 0;
    return (amount + projectionValue + this.GASTONOTARIAL + tax);
  }


  getPayment(rate, nper: number, initialCapital: number) {
    const part1 = rate * Math.pow(1 + rate, nper);
    const part2 = Math.pow(1 + rate, nper) - 1 ;
    return (initialCapital * (part1 / part2));
  }
  getPaymentRate(rate, per: number, nper: number, initialCapital: number) {
    this.totalCuota = 0;
    // https://users.dcc.uchile.cl/~anpereir/evaluacion/08MatematicasFinancieras.pdf ;D
    let acumCapital = initialCapital;
    let tempCapital = initialCapital;
    this.payments = [];
    for (let index = 0; index < nper; index ++) {
      let obj = {
        payment:this.payment,
        interest : 0,
        amortizacion: 0,
        cuota:0,
        saldoCapital:0,
        degravamen:0,
        cesantia:0,
        projection:this.projectionValue
      }
      var interest = 0;
      var amortizacion = 0;
      interest = (rate * tempCapital);
      amortizacion =  this.payment - interest;
      tempCapital = (tempCapital - amortizacion);
      obj.interest = interest;
      obj.saldoCapital = tempCapital;
      obj.amortizacion = amortizacion;
      obj.degravamen = initialCapital * this.degravamen;
      obj.cesantia = initialCapital * this.creditDetail.getSeverance();
      obj.cuota = this.payment + this.projectionValue + (this.initialCapital * this.degravamen) + (this.creditDetail.getSeverance() * initialCapital);
      this.totalCuota +=  obj.cuota;
      this.payments.push(obj)
    }
    return acumCapital;
  }

  public getIrr(capital: number, cuotes: any[], guess: number, months: number) {
    let tempCapital = capital * -1;
    let values = [tempCapital]
    for (let index = 0; index < months; index++) {
      values.push(0);
    }
    cuotes.forEach(element => {
      values.push(Math.round(element.cuota));
    });
    let finance = new Finance();
    return finance.IRR.apply(this, values) * 12;
  }


  getProjection(payments: number, projectedDays: number, projectedAmount:number){
    if(payments<12){
      if(projectedDays<30){
        let part2 = payments < 12 ? payments : 12;
        return projectedAmount / part2;
      }
      return 0;
    }
    return 0;
  }
  get_simulacion_pdf(){
    let obj = {
      interestRate : this.creditDetail.getInterestRate(),
      amount: this.creditFormGroup.controls.amount.value,
      fechaOtorgamiento: this.getCurretDate(),
      gastoNotarial: this.GASTONOTARIAL,
      impuesto: this.taxtAmount,
      uf: this.ufData.valor
    }
    // refactorizar
    this.functionsServices.get_simulacion_pdf(
      // REFACTOR OBJ

      this.payments, this.creditDetail.getProjectedAmount(), this.initialCapital,
      obj).subscribe(
      (response)=>{
        const blob = new Blob([response]);
        saveAs(blob, 'SIMULACION_CREDITO.pdf')
      }), e => {throwError(e);}
  }
  OnDestroy(){
    this.logOutAnonymous();
  }

  logOutAnonymous(){
    this.authService.logout()
  }

  getDv(run){
    var M=0,S=1;
	  for(;run;run=Math.floor(run/10))
      S=(S+run%10*(9-M++%6))%11;
	  //return S?S-1:'k';

      return(S?S-1:'k');
  }


}
