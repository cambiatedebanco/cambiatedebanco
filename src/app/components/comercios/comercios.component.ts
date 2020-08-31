import { Component, OnInit ,Input} from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-comercios',
  templateUrl: './comercios.component.html',
  styleUrls: ['./comercios.component.css']
})
export class ComerciosComponent implements OnInit {
@Input('comercios')comercios;
  
  constructor(public _firestoreservice: FirestoreService) { 


  }

  ngOnInit() {
  }


}
