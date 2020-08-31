import { Component, OnInit,Input } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
@Component({
  selector: 'app-ppff-seguro',
  templateUrl: './ppff-seguro.component.html',
  styleUrls: ['./ppff-seguro.component.css']
})
export class PpffSeguroComponent implements OnInit {
  @Input('empresas')empresas;
  constructor() { }

  ngOnInit() {
    registerLocaleData( es );
  }

}
