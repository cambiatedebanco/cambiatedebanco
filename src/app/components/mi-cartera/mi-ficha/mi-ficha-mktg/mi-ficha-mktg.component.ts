import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mi-ficha-mktg',
  templateUrl: './mi-ficha-mktg.component.html',
  styleUrls: ['./mi-ficha-mktg.component.css']
})
export class MiFichaMktgComponent implements OnInit {
  _images = []

  @Input() set carouselMarketing(carouselMarketing){
    this._images = carouselMarketing;
   
  }
  get carouselMarketing(){
    return this._images;
  }
  constructor() { }

  ngOnInit() {
  }

}
