import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AuthService,
               private router: Router) {}

  canActivate(): boolean  {
    let user = this.auth.isUserLoggedIn()
    if (user) {
      // Check anonymous
      if(user.isAnonymous){
        return this.kickUser();
      }
      return true;
    } 
    this.kickUser();

  }
  kickUser(){
    this.router.navigateByUrl('/login');
    return false;

  }
}
