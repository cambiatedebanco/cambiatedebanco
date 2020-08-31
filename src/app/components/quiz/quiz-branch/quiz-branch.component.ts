import { Component, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-quiz-branch',
  templateUrl: './quiz-branch.component.html',
  styleUrls: ['./quiz-branch.component.css']
})
export class QuizBranchComponent implements OnInit {
  form = null;
  isValue = false;
  flag = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      isCredit: [null, Validators.required],
  });
   }

  respuesta_base = "En base a tus respuestas, entendemos que tu necesidad es:"


  ngOnInit() {
   

  }
  checked(){
    this.flag = true;
    this.isValue = this.form.value.isCredit;
  }
  
}
