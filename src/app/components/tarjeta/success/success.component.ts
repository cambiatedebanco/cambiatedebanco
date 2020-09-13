import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  showVariable: any;
  constructor(  private route: ActivatedRoute,
    private _route: Router) { }

  ngOnInit() {
    this.showVariable=this.route.snapshot.data.postData;
   console.log(this.showVariable);
  }

}
