import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ofertas-uno',
  templateUrl: './ofertas-uno.component.html',
  styleUrls: ['./ofertas-uno.component.css']
})

export class OfertasUnoComponent implements OnInit {
  @Input('usoOferta') usoOferta;
  constructor() { }

  ngOnInit() {
  }

}
