import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { methods } from 'underscore';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  showVariable: any;
  constructor(  private route: ActivatedRoute,
    private _route: Router) { }

  ngOnInit( ) {
    console.log(this.route.snapshot.queryParamMap.getAll("token"));
    
  }

}
