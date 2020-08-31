import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsFichaComponent } from './leads-ficha.component';

describe('LeadsFichaComponent', () => {
  let component: LeadsFichaComponent;
  let fixture: ComponentFixture<LeadsFichaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsFichaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
