import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'dialog-login-externo',
    templateUrl: 'dialog-login-externo.html',
  })

  export class DialogLoginExterno {
    loginFormGroup: FormGroup;
    errorMessage: String;
    constructor(public dialogRef: MatDialogRef<DialogLoginExterno>, public formBuilder: FormBuilder, public authService: AuthService){
      this.loginFormGroup = this.formBuilder.group({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
      })      
    }
    isSubmit: boolean = false;
    ngOnInit(){

    }
    onNoClick():void {
      this.dialogRef.close();
    }

    submitCredentials(){
      this.isSubmit = true;
      this.errorMessage = "";

      if(this.loginFormGroup.invalid){
        return;
      }
      let data = this.loginFormGroup.value;
      this.authService.login(data.email, data.password).then(_ => {
        this.dialogRef.close(_);
      }).catch(message => {
        console.log(message)
        this.errorMessage = message;
        return;
      })
  
      // this.dialogRef.close(result)
    }
  }