import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { getHeaderStts } from '../utility';
import { PostgresService } from 'src/app/services/postgres/postgres.service';

@Component({
  selector: 'login-app',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'firebaseLogin';

  selectedVal: string;
  responseMessage: string = '';
  responseMessageType: string = '';
  emailInput: string;
  passwordInput: string;
  isForgotPassword: boolean;
  userDetails: any;
  userPerfil: any;
  user: any;
  loggedIn: boolean;
  numero;
  data: any;

  dangerMessage = "No es posible ingresar, intente nuevamente.";
  successMessage = "Bienvenido a CEOcrm, ingreso exitoso!.";

  constructor(
    private authService: AuthService,
    private router: Router,
    private postgresService: PostgresService
  ) {
    this.selectedVal = 'login';
    this.isForgotPassword = false;

    this.numero = Math.floor(Math.random() * 4) + 1

  }

  ngOnInit() {   

  }

  // Comman Method to Show Message and Hide after 2 seconds
  showMessage(type, msg) { 
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = "";
    }, 2000);
  }

  // Called on switching Login/ Register tabs
  public onValChange(val: string) {
    this.showMessage("", "");
    this.selectedVal = val;
  }

  // Check localStorage is having User Data
  isUserLoggedIn() {
    this.user = this.authService.isUserLoggedIn();

    if (this.user === null) {
      this.onWrongLogin();
      return;
    }
    this.postgresService.getUsuarioPorMail(this.user.email, getHeaderStts(this.user)).subscribe(
      resp => {
        if(resp.length > 0){

          this.router.navigate([`/mi-cartera-home`]);

        } else {
          this.onWrongLogin();
          return;
        }
      }
    )




  }

  // SignOut Firebase Session and Clean LocalStorage
  logoutUser() {
    this.authService.logout()
      .then(res => {

        this.userDetails = undefined;
        this.userPerfil= undefined;
        localStorage.removeItem('cookieTab');
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');

      }, err => {
        this.showMessage("danger", err.message);
      });
  }

  // Login user with  provided Email/ Password
  loginUser() {
    this.responseMessage = "";
    this.authService.login(this.emailInput, this.passwordInput)
      .then(res => {
        this.isUserLoggedIn();
      }, err => {
        this.showMessage("danger", err.message);
      });
  }

  // Register user with  provided Email/ Password
  registerUser() {
    this.authService.register(this.emailInput, this.passwordInput)
      .then(res => {

        // Send Varification link in email
        this.authService.sendEmailVerification().then(res => {

          this.isForgotPassword = false;
          this.showMessage("success", "Registration Successful! Please Verify Your Email");
        }, err => {
          this.showMessage("danger", err.message);
        });
        this.isUserLoggedIn();


      }, err => {
        this.showMessage("danger", err.message);
      });
  }

  // Send link on given email to reset password
  forgotPassword() {
    this.authService.sendPasswordResetEmail(this.emailInput)
      .then(res => {

        this.isForgotPassword = false;
        this.showMessage("success", "Please Check Your Email");
      }, err => {
        this.showMessage("danger", err.message);
      });
  }

  // Open Popup to Login with Google Account
  googleLogin() {
    this.authService.loginWithGoogle()
      .then(res => {
        this.isUserLoggedIn();
      }, err => {
        this.showMessage("danger", this.dangerMessage);
      });
  }
  onWrongLogin() {
    this.router.navigate([`/login`]);
    this.showMessage("danger", this.dangerMessage);
  }
}
