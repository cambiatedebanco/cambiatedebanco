import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferidosSeguroCarComponent } from './referidos-seguro-car.component';

describe('ReferidosSeguroCarComponent', () => {
  let component: ReferidosSeguroCarComponent;
  let fixture: ComponentFixture<ReferidosSeguroCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferidosSeguroCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferidosSeguroCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
