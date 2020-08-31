import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import Swal from 'sweetalert2';
import {AuthService} from '../../services/auth.service';


// TIEMPO EN SEGUNDOS 
const TIMETOLEAVE = 1200
const TIMEINTERVAL = 1200

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.css']
})
export class IdleComponent implements OnInit {
  lastPing?: Date = null;
  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  constructor(private idle: Idle,  private router: Router, private keepalive:Keepalive,
    private authService: AuthService) {
    idle.setIdle(TIMETOLEAVE);
    idle.setTimeout(TIMETOLEAVE);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      // Al detectar acciones
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      // TIME OUT
      this.triggerSwal()
    });
    keepalive.interval(TIMEINTERVAL);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }



  ngOnInit() {
  }

  reset() {
    this.idle.watch();
  }
  triggerSwal(){
    console.log('trigger swal')
    this.swalWithBootstrapButtons.fire({
      title: 'Aviso de cierre de sesión',
      text: "Tu sesión está a punto de expirar, ¿Necesitas más tiempo?",
      timer: 25000,
      showCancelButton: true,
      confirmButtonClass: "btn-info",
      confirmButtonText: 'Mantener sesión activa',
      cancelButtonText: 'Cerrar sesión',
      reverseButtons: true,
    }).then((result)=> {
      if(result.dismiss == Swal.DismissReason.timer){
        this.forceLogOut();
        return
      }
      if(result.value){
        this.reset();
        return;
      }
      this.forceLogOut();
      return;
    })
  }
  forceLogOut(){
    this.authService.logout().then(
      ()=> {
        localStorage.removeItem('user');
        localStorage.removeItem('user_perfil');
        this.router.navigate([`/login`]);
        return;
      }
    );
  }

}
