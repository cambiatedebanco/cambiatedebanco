import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMoraComponent } from './form-mora.component';

describe('FormMoraComponent', () => {
  let component: FormMoraComponent;
  let fixture: ComponentFixture<FormMoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
