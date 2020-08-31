import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-empresa',
  templateUrl: './main-empresa.component.html',
  styleUrls: ['./main-empresa.component.css']
})
export class MainEmpresaComponent implements OnInit {
  lat: number = -33.4372;
  lng: number =-70.6506;

  constructor() { }

  ngOnInit() {
  }

}
