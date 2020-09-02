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
    this.user = this.authService.isUserLoggedIn();
    this.loggedIn = (this.user != null);
    if (this.user != null) {
      let userProfile = JSON.parse(localStorage.getItem("user_perfil"))
      if (parseInt(userProfile.id_cargo) === 5) {
        this.router.navigate(['home-tam'], { skipLocationChange: false });
      }
      this.router.navigate([`/home2`]);
    }

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
        if (resp) {
          this.showMessage("success", this.successMessage);

              this.router.navigate([`/mi-cartera-home`]);

        } else {
          this.onWrongLogin();
          return;
        }
      }
    )

    /*let time = new Date();

    let mes='0'+ (time.getMonth()+1).toString();
    let dia='0'+ (time.getDate()).toString();

    this.data={
      "rut_colaborador":parseInt(this.userPerfil.RUT),
      "email":this.userPerfil.EMAIL.toLowerCase(),
      "timestamp":parseInt(time.getTime().toString().substr(0,10)),
      "periodo": parseInt(time.getFullYear()+ mes.substring(mes.length, mes.length - 2)),
      "fecha":parseInt(time.getFullYear()+ mes.substring(mes.length, mes.length - 2)  + dia.substring(dia.length, dia.length - 2)) ,
      "query":"login",
      "modulo":"LoginComponent"

    };
   this._firestore.createLog('cla_scanner_log',this.data);
*/




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
        this.showMessage("success", this.successMessage);
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
