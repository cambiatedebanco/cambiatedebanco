import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';



@Injectable({providedIn: 'root'})
export class DummyGuard implements CanActivate {
    constructor(private router: Router){
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
        return this.kickUser()
    }

    kickUser(){
        this.router.navigateByUrl('/login');
        return false;
      }
}