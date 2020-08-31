import { Injectable } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGService {
  private user: SocialUser;
  private loggedIn: boolean;
  userToken: string;
  constructor(private authService: AuthService,private router: Router) {
    this.userToken=this.leerToken();
  
   }


  logout() {
   // localStorage.removeItem('token');
   // localStorage.removeItem('expira');
  
    this.authService.signOut(true);

    sessionStorage.clear();
    localStorage.clear();
    this.user = null;
    this.router.navigate([`/login`]);
  }

  login( ) {


    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialusers => {

      this.guardarToken(socialusers.idToken, socialusers.email);
    });
    }

  private guardarToken( idToken: string, email: string ) {
    
    if (email=='carlos.villena@cajalosandes.cl'){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );


    this.router.navigate([`/empresas`]);
  }else{
    this.logout();
  }
  }

  leerToken() {

    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;

  }


 estaAutenticado(): boolean {


  if ( this.userToken.length < 2 ) {
    return false;
  }

  const expira = Number(localStorage.getItem('expira'));
  const expiraDate = new Date();
  expiraDate.setTime(expira);

  if ( expiraDate > new Date() ) {
    return true;
  } else {
    return false;
  }


}



}
