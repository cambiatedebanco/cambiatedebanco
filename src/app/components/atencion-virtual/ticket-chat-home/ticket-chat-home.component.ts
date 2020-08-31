import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ticket-chat-home',
  templateUrl: './ticket-chat-home.component.html',
  styleUrls: ['./ticket-chat-home.component.css']
})
export class TicketChatHomeComponent implements OnInit, OnDestroy   {
  navigationSubscription;
  chatTalks: any = [];
  params: any;
  idDoc: any;

  constructor(public firestoreservice: FirestoreService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService) {

      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
    }

  initialiseInvites() {
    const sub = this.route.params.subscribe(params => {
      this.params = params;
      this.idDoc = params.idDoc;
   });

    this.firestoreservice.getChatByDocument(this.params.idDoc).subscribe((talksSnap: any) => {
      this.chatTalks = [];
      talksSnap.forEach((chat: any) => {
          this.chatTalks.push({
            id: chat.payload.doc.id,
            data: chat.payload.doc.data()
          });

      });
    });
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
