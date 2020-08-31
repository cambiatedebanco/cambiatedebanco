import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorBaseComponent } from './simulador-base.component';

describe('SimuladorBaseComponent', () => {
  let component: SimuladorBaseComponent;
  let fixture: ComponentFixture<SimuladorBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimuladorBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuladorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
