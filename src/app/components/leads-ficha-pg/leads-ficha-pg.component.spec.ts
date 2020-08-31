import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsFichaPgComponent } from './leads-ficha-pg.component';

describe('LeadsFichaPgComponent', () => {
  let component: LeadsFichaPgComponent;
  let fixture: ComponentFixture<LeadsFichaPgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsFichaPgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsFichaPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
