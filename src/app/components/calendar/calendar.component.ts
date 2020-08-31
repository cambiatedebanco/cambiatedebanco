import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { AuthService } from '../../services/auth.service';
import * as _ from 'underscore';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  selectedEvent: any;
  sideBarDetail = false;
  groupArrays;

  ngOnInit() {
  }

  constructor(private _auth: AuthService) {}

  view: CalendarView = CalendarView.Day;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };


  events: any[] = [];
  
  getEvents(){
   this.events = [];
   this.groupArrays = [];
   this._auth.getCalendar().then(result => {
    if(typeof result === 'undefined'){return;}
    result.forEach(element => {
    this.addEvent(element);});

    const groups = this.events.reduce((groups, event) => {
      let date = JSON.stringify(event.start).split('T')[0].replace(/['"']/g, '');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});

    this.groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        events: groups[date]
      };
    });
    
   }).catch(error => {
     console.error(error)
     console.error('error al llamar eventos del calendario')
   })

  }


  addEvent(googleEvent): void {
    this.events = [
      ...this.events,
      {
        title: googleEvent.summary,
        start: new Date(googleEvent.start.dateTime),
        end: new Date(googleEvent.end.dateTime),
        description: googleEvent.description,
        url: typeof googleEvent.source === 'undefined' ? '' : googleEvent.source.url
      },
    ];
  }

  activeDayIsOpen: boolean = true;
  isListView:boolean = true;
  

  toggleDetail(event:any){
    this.isListView = !this.isListView;
    console.log(this.isListView);
    this.selectedEvent = event;
  }



  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
