import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empresa-info',
  templateUrl: './empresa-info.component.html',
  styleUrls: ['./empresa-info.component.css']
})
export class EmpresaInfoComponent implements OnInit {
  @Input('empresas')empresas;
  constructor() { }

  ngOnInit() {
  }

}
