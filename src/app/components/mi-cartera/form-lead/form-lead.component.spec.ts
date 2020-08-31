import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeadComponent } from './form-lead.component';

describe('FormLeadComponent', () => {
  let component: FormLeadComponent;
  let fixture: ComponentFixture<FormLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
