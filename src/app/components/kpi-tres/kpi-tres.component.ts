import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-kpi-tres',
  templateUrl: './kpi-tres.component.html',
  styleUrls: ['./kpi-tres.component.css']
})
export class KpiTresComponent implements OnInit {
  @Input('empresas')empresas;
  constructor() { }

  ngOnInit() {
  }

}
