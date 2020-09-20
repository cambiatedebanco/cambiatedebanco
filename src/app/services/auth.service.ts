import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { PostgresService } from './postgres/postgres.service';
import { getHeaderStts } from '../components/utility';


declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User>;
  calendarItems: any[];
  private _token: String;
  constructor(
    public angularFireAuth: AngularFireAuth,
    public router: Router,
    private postgresService: PostgresService,
  ) {
    this.initClient()
    this.getestado();

    this.user$ = angularFireAuth.authState;


  }

  initClient() {
    gapi.load('client', () => {

      gapi.client.init({
        apiKey: environment.firebase.apiKey,
        clientId: environment.gcp.clientId,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/userinfo.email'

      })
      gapi.client.load('calendar', 'v3', () => {
       // console.log('calendar ready');
      });
     
    });
  }
  getestado() {
    this.angularFireAuth.authState.subscribe( userResponse => {
      if (userResponse && userResponse.isAnonymous == false) {
        let userStr = JSON.stringify(userResponse);
        localStorage.setItem('user', userStr);
        this._token = JSON.parse(userStr).stsTokenManager.accessToken
        this.postgresService.getUsuarioPorMail(userResponse.email, getHeaderStts(JSON.parse(userStr))).subscribe(
          resp => {
            if(resp.length > 0){
              localStorage.setItem('user_perfil', JSON.stringify(resp[0]));
           
            }else{
               localStorage.setItem('user', null);
               this.router.navigate([`/login`]);
            }
          }
        )

      } else {
        localStorage.setItem('user', null);

      }
    })

  }

  async login(email: string, password: string) {
    return await  this.angularFireAuth.auth.signInWithEmailAndPassword(email, password).then(
      response => {
        if(response){
          localStorage.setItem('user', JSON.stringify(response.user))
          return true;
        }
      }
    ).catch(error => {
      throw new Error(error.message);
    })
   
  }

  async register(email: string, password: string) {
    return await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password).then(
      result => {
        return result
      }
    ).catch(error =>{
      throw new Error(error.message)
    })
  }

  async sendEmailVerification() {
    return await this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    return await this.angularFireAuth.auth.signOut();
  }

  /** 
   * Initiate the password reset process for this user 
   * @param email email of the user 
   */ 
  resetPasswordInit(email: string) { 
    return this.angularFireAuth.auth.sendPasswordResetEmail(
      email, 
      { url: 'http://localhost:4200/auth' }); 
    } 

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
  }
  isUserLoggedInAuth() {
    return this.angularFireAuth.authState.pipe(first());
  }

  isUserLoggedInPerfil() {
    return JSON.parse(localStorage.getItem('user_perfil'));
  }

  getToken() {
    return this._token;
  }

  setLocalStorageUser(){
    
  }

  async  loginWithGoogle() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    return await this.angularFireAuth.auth.signInWithCredential(credential).then(function (result) {
      localStorage.setItem('user', JSON.stringify(result.user))
    }).catch(function (error) {
      console.log(error.code);
      console.log(error.message);
    })

    //    provider.addScope();


    //return await this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.

    // ...
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });;
  }
  async getCalendar() {
    try {
      this.calendarItems = [];
      const events = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 30,
        orderBy: 'startTime'
      })

      let eventCalendar = typeof events.result.items === 'undefined' ? [] : events.result.items;
      return eventCalendar;
    } catch (error) {
      console.log(error);
    }

  }

  async insertEvents(description, fechaInicio, summary, url,attended:string) {
    const timeZone = 'America/Santiago'
    try {
      const insert = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        start: {
          dateTime: fechaInicio,
          timeZone: timeZone
        },
        end: {
          dateTime: fechaInicio,
          timeZone: timeZone
        },
        summary: summary,
        description: description,
        // attendees: [
        //   {email: 'carlos.villena@cajalosandes.cl'},
        // ],
        source:{url:url}

      })
      await this.getCalendar();
    } catch (error) {
      console.error(`Error al insertar evento:  ${error.message}`)
      let body = JSON.parse(error.body)

      console.error(body.error)
    }

  }




  sendMessage(base64EncodedEmail) {
    //var isSigned = gapi.auth2.getAuthInstance().isSignedIn.get();
    const request = gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
          raw: base64EncodedEmail
      }
    });
    return request;
}


  signInAnonymously() {
    let user = this.isUserLoggedInAuth();
    if (user) { return; }
    auth().signInAnonymously().catch(function (error) {
    })
  }



}
const hoursFromNow = (n) => {
  return "2020-6-4T07:20:50.52Z"
}

