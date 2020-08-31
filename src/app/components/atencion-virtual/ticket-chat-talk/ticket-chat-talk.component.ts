import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef, Input } from '@angular/core';
import { FirestoreService } from '../../../services/firestore/firestore.service';

@Component({
  selector: 'app-ticket-chat-talk',
  templateUrl: './ticket-chat-talk.component.html',
  styleUrls: ['./ticket-chat-talk.component.css']
})
export class TicketChatTalkComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller', {static: false}) feedContainer: ElementRef;
  @Input() chatTalks: any;
  @Input() params: any;
  mensaje: any;

  constructor(public firestoreservice: FirestoreService) {

  }

  ngOnInit() {

  }

  sendMessage(idDocumento, rutEjecutivo) {

    const date = new Date();
    const timeStamp = parseInt(date.getTime().toString().substring(0, 10), 0);
    const data = {
      fecha_mensaje: date,
      texto: this.mensaje,
      rut: rutEjecutivo,
    };

    this.firestoreservice.insertChatMensaje(idDocumento, data);

    this.mensaje = '';
  }

  onSubmitEnter(event, idDocumento, rutEjecutivo) {
      if (event.keyCode === 13) {
        this.sendMessage(idDocumento, rutEjecutivo);
      }
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
                 (now.getUTCMonth() + 1) + '/' +
                 now.getUTCDate();
    const time = now.getUTCHours() + ':' +
                 now.getUTCMinutes() + ':' +
                 now.getUTCSeconds();

    return (date + ' ' + time);
  }

}
