import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-empresa-demografico',
  templateUrl: './empresa-demografico.component.html',
  styleUrls: ['./empresa-demografico.component.css']
})
export class EmpresaDemograficoComponent implements OnInit {
  @Input('empresas')empresas;
  constructor() { 
    

  }

  ngOnInit() {
  }
  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
