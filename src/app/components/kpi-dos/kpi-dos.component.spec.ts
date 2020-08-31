import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDosComponent } from './kpi-dos.component';

describe('KpiDosComponent', () => {
  let component: KpiDosComponent;
  let fixture: ComponentFixture<KpiDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
