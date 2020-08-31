import { Injectable, INJECTOR } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
    // GUARDIA DE RUTAS CUSTOM 
    constructor(private router: Router, private authGuard: AuthGuard) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
        // 
        if(this.authGuard.canActivate()){

            let profile = JSON.parse(localStorage.getItem("user_perfil"))
            if(profile){
                let result = profile.id_cargo === "7" ||  profile.nivel_acceso === "99"
                if(result){
                    return true;
                }
            }
        }


        this.kickUser()
    }

    kickUser(){
        this.router.navigateByUrl('/login');
        return false;
      }
}