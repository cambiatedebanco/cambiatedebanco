import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiUnoComponent } from './kpi-uno.component';

describe('KpiUnoComponent', () => {
  let component: KpiUnoComponent;
  let fixture: ComponentFixture<KpiUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
