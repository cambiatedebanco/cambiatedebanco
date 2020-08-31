import { Component, OnInit, Input } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-uso-bss',
  templateUrl: './uso-bss.component.html',
  styleUrls: ['./uso-bss.component.css']
})
export class UsoBssComponent implements OnInit {
  @Input('usoBBSS')usoBBSS;

  constructor() { 
    

  }

  ngOnInit() {
    registerLocaleData( es );
  }

}
