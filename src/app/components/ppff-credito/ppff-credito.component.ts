import { Component, OnInit ,Input} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

@Component({
  selector: 'app-ppff-credito',
  templateUrl: './ppff-credito.component.html',
  styleUrls: ['./ppff-credito.component.css']
})
export class PpffCreditoComponent implements OnInit {
  @Input('empresas')empresas;
  @Input('usoCredito')usoCredito;

  constructor() { }

  ngOnInit() {
    registerLocaleData( es );
  }

}
