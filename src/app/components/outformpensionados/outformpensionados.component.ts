import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { RutValidator } from '../../rut.validator';


@Component({
  selector: 'app-outformpensionados',
  templateUrl: './outformpensionados.component.html',
  styleUrls: ['./outformpensionados.component.css']
})
export class OutformpensionadosComponent implements OnInit {
  registerForm: FormGroup;
    submitted = false;
    startAt = new Subject();
    endAt = new Subject();
    public emps:any ;
    public allemps: any;
    startobs = this.startAt.asObservable();
    endobs = this.endAt.asObservable();
    navigationSubscription;
    fecha: any;
    constructor(
      private formBuilder: FormBuilder, 
      public _firestoreservice: FirestoreService,
      private _route: Router, 
      private _auth: AuthService) {

      }

     Right(str, n){
      if (n <= 0)
         return "";
      else if (n > String(str).length)
         return str;
      else {
         var iLen = String(str).length;
         return String(str).substring(iLen, iLen - n);
      }
  }


    ngOnInit() {
        this._auth.signInAnonymously();
        this.registerForm = this.formBuilder.group({
            rut: new FormControl('', [Validators.required, RutValidator.validaRut]),
            nombre: ['', Validators.required],
            comuna: ['', Validators.required],
            telefono: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });


        combineLatest(this.startobs, this.endobs).subscribe((value:any) => {
        
            this._firestoreservice.searchComuna(value[0]).subscribe((resp:any)=>{
              this.allemps = resp;
            });
          
        
        });

    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        
   
      
      this.submitted = true;


        const date = new Date();
        let fecha = date.getFullYear().toString() +  this.Right('00' + (date.getMonth()+1).toString(),2) + this.Right('00' + date.getDate().toString(),2)
        let timestamp = parseInt(date.getTime().toString().substring(0,10));

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        Swal.fire({
          title: 'Espera',
          text:'Enviando Información',
          type: 'info',
          allowOutsideClick: false
          
          
          });
          Swal.showLoading();

        let datos=this.registerForm.value;
        let data={
          nombre: datos.nombre.toUpperCase(),
          email: datos.email.toLowerCase(),
          rut: datos.rut,
          comuna: datos.comuna.toUpperCase().trim(),
          platform: 'web',
          phone_number: datos.telefono,
          created_time: date,
          observaciones:'',
          fecha: fecha,
          timestamp: timestamp,
          tipo_campana: 1
          

        };
        this._firestoreservice.createPensionado(data);
        Swal.fire({
          title: 'Muchas gracias',
          text:'Uno de nuestros ejecutivos se comunicará contigo a la brevedad',
          type: 'success'
        }).then(function() {
         
      });
        this.registerForm.reset();
  
        this.submitted = false;

      
    }
    onEnter($event){
      let q = $event.source.value;
     
  
    }
    OnDestroy(){
      this.logOutAnonymous();
    }

    logOutAnonymous(){
      this._auth.logout()
    }
    
    search($event) {
      let q = $event.target.value;

      if (q != '') {
        this.startAt.next(q.toUpperCase());
        this.endAt.next(q.toUpperCase() + "\uf8ff");
      }
      else {
        this.emps = this.allemps;
      }
    }
}
