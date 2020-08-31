import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mi-ficha-productos',
  templateUrl: './mi-ficha-productos.component.html',
  styleUrls: ['./mi-ficha-productos.component.css']
})
export class MiFichaProductosComponent implements OnInit {

  _creditos = [];
  _seguros = [];
  _ahorros = [];
  
  @Input() set creditosAfiliado(creditosAfiliado){
    this._creditos = creditosAfiliado;
  }
  get creditosAfiliado(){
    return this._creditos;
  }

  @Input() set segurosAfiliado(seguroAfiliado){
    this._seguros = seguroAfiliado;
  }
  get segurosAfiliado(){
    return this._seguros;
  }

  @Input() set ahorroAfiliado(ahorroAfiliado){
    this._ahorros = ahorroAfiliado;
  }
  get ahorroAfiliado(){
    return this._ahorros;
  }

  constructor() { }

  ngOnInit() {
  }

}
