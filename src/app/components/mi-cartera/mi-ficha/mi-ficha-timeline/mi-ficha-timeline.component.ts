import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mi-ficha-timeline',
  templateUrl: './mi-ficha-timeline.component.html',
  styleUrls: ['./mi-ficha-timeline.component.css']
})
export class MiFichaTimelineComponent implements OnInit { 
  _timeLineData = [];
  viewData =[];
  countCEO = null;
  countPresencial = null;
  countEmail = null;
  countCallCenter = null;
  countLeads = null;
  countRedesSociales = null;
  @Input() headers;

  @Input() 
  set timeLineData(any: any[]) {
    if(any.length>0){
      this._timeLineData = any;
      this.viewData = this._timeLineData;
      this.countCEO = this.countByCanal('CEO');
      this.countPresencial = this.countByCanal('Presencial');
      this.countEmail = this.countByCanal('E-mail');
      this.countCallCenter = this.countByCanal('CallCenter');
      this.countLeads = this.countByCanal('Leads');
      this.countRedesSociales = this.countByCanal('Redes Sociales');
    }else{
      this.viewData = this._timeLineData = [];
      this.countPresencial =this.countCEO = 0
      this.countEmail = this.countCallCenter = 0;
      this.countLeads = this.countRedesSociales = 0;
    }
  
  }
  get timeLineData(): any[] {
    return this._timeLineData;
  }


  constructor() { }

  ngOnInit() {
  }

  filterBy(canal: string) {
    this.viewData = this._timeLineData.filter((data) => data.canal === canal);
  }

  countByCanal(canal: string) {
    const countArray = this._timeLineData.filter((data) => data.canal === canal).length;
    return countArray;
  }
  ngOnDestroy(){

  }
}
