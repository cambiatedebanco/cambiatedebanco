import { Component, OnInit, Input } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-afiliado-demografico',
  templateUrl: './afiliado-demografico.component.html',
  styleUrls: ['./afiliado-demografico.component.css']
})
export class AfiliadoDemograficoComponent implements OnInit {

  @Input('afiliados')afiliados;
  constructor() { 
    

  }

  ngOnInit() {
    registerLocaleData( es );
  }

}
