import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTresComponent } from './kpi-tres.component';

describe('KpiTresComponent', () => {
  let component: KpiTresComponent;
  let fixture: ComponentFixture<KpiTresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiTresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
