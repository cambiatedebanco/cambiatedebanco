import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})


export class EmpresasComponent  {
  @ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

  batch = 10;
  theEnd = false;

  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;
public empresas: any=[];
  constructor(public _firestoreservice: AngularFirestore) {

    const batchMap = this.offset.pipe(
      throttleTime(500),
      mergeMap(n => this.getBatch(n)),
      scan((acc, batch) => {
        return { ...acc, ...batch };
      }, {})
    );

    this.infinite = batchMap.pipe(map(v => Object.values(v)));







  }

  getBatch(offset) {

    return this._firestoreservice
    .collection('cla_scanner_empresa', ref =>
      ref
        .orderBy('RUT_EMPRESA')
        .startAfter(offset)
        .limit(this.batch)
    )
    .snapshotChanges()
    .pipe(
      tap(arr => (arr.length ? null : (this.theEnd = true))),
      map(arr => {
        return arr.reduce((acc, cur) => {
          const id = cur.payload.doc.id;
          const data = cur.payload.doc.data();

          return { ...acc, [id]: data };
        }, {});
      })
    );
  }




  nextBatch(e, offset) {
    if (this.theEnd) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (end === total) {
      this.offset.next(offset);
    }
  }

  trackByIdx(i) {
    return i;
  }

}


