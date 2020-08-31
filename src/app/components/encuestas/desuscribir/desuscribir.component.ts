import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-desuscribir',
  templateUrl: './desuscribir.component.html',
  styleUrls: ['./desuscribir.component.css']
})
export class DesuscribirComponent implements OnInit {

  bannedEmail: string;
  bannedForm: FormGroup;
  done: boolean = false;
  constructor(private route: ActivatedRoute, private firestorageService: FirestoreService) { }

  ngOnInit() {
    console.log('init')
    this.bannedEmail = this.route.snapshot.paramMap.get('email');
    console.log(this.bannedEmail)
    this.prepareForm(this.bannedEmail);
  }
  prepareForm(email:string = ''){
    this.bannedForm = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email])
    })
  }
  saveBannedMail(){
    if(!this.bannedForm.valid){
      return
    }
    this.firestorageService.addUnsuscribedMail(this.bannedForm.value);
    this.done = true;
  }
}
