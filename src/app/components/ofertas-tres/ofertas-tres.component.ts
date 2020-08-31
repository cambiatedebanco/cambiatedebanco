import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-ofertas-tres',
  templateUrl: './ofertas-tres.component.html',
  styleUrls: ['./ofertas-tres.component.css']
})
export class OfertasTresComponent implements OnInit {
  @Input('usoOferta') usoOferta;
  constructor() { }

  ngOnInit() {
  }

}
