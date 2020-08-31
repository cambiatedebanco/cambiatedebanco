import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMainComponent } from './quiz-main.component';

describe('QuizMainComponent', () => {
  let component: QuizMainComponent;
  let fixture: ComponentFixture<QuizMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
