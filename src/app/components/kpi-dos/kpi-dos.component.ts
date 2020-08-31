import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-dos',
  templateUrl: './kpi-dos.component.html',
  styleUrls: ['./kpi-dos.component.css']
})
export class KpiDosComponent implements OnInit {
  @Input('empresas')empresas;
  @Input() ofertaCredDig: any;
  constructor() { }

  ngOnInit() {
  }

}
