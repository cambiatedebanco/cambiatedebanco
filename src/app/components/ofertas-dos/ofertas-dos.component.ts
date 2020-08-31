import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ofertas-dos',
  templateUrl: './ofertas-dos.component.html',
  styleUrls: ['./ofertas-dos.component.css']
})
export class OfertasDosComponent implements OnInit {
@Input('usoOferta') usoOferta;
  constructor() { }

  ngOnInit() {
  }

}
