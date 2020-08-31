import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCuatroComponent } from './kpi-cuatro.component';

describe('KpiCuatroComponent', () => {
  let component: KpiCuatroComponent;
  let fixture: ComponentFixture<KpiCuatroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiCuatroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCuatroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
