import { Component, OnInit, Input } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-oferta-af-credito',
  templateUrl: './oferta-af-credito.component.html',
  styleUrls: ['./oferta-af-credito.component.css']
})
export class OfertaAfCreditoComponent implements OnInit {
  @Input('ofertaAfiliado')ofertaAfiliado;
  constructor() { }

  ngOnInit() {
    registerLocaleData( es );
  }

}
