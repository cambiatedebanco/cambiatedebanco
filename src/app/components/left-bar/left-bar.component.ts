import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.css']
})
export class LeftBarComponent implements OnInit {
  navigationSubscription: Subscription;
  userPerfil: any;

  constructor(
    private route: Router) {
    this.navigationSubscription = this.route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });

  }

  initialiseInvites(){    
    this.userPerfil = JSON.parse(localStorage.getItem('user_perfil'));
  }
 
  
  ngOnInit() {
  }

  ngOnDestroy(): void {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

}
