import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-kpi-uno',
  templateUrl: './kpi-uno.component.html',
  styleUrls: ['./kpi-uno.component.css']
})
export class KpiUnoComponent implements OnInit {
  @Input('empresas')empresas;
  constructor() { }

  ngOnInit() {
  }

}
