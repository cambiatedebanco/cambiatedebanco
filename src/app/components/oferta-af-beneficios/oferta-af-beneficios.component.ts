import { Component, OnInit, Input } from '@angular/core';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-oferta-af-beneficios',
  templateUrl: './oferta-af-beneficios.component.html',
  styleUrls: ['./oferta-af-beneficios.component.css']
})
export class OfertaAfBeneficiosComponent implements OnInit {
  @Input('ofertaAfiliado')ofertaAfiliado;
  @Input('afiliados')afiliados;
  constructor() { }

  ngOnInit() {
    registerLocaleData( es );
  }

}
