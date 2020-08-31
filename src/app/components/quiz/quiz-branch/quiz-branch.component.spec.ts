import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizBranchComponent } from './quiz-branch.component';

describe('QuizBranchComponent', () => {
  let component: QuizBranchComponent;
  let fixture: ComponentFixture<QuizBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
