import { Component, OnInit , Input} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
@Component({
  selector: 'app-ppff-ahorro',
  templateUrl: './ppff-ahorro.component.html',
  styleUrls: ['./ppff-ahorro.component.css']
})
export class PpffAhorroComponent implements OnInit {
  @Input('empresas')empresas;
  @Input('usoAhorro')usoAhorro;
  constructor() { }

  ngOnInit() {
    registerLocaleData( es );
  }

}
