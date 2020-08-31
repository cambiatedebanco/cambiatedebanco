import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorExternoComponent } from './simulador-externo.component';

describe('SimuladorExternoComponent', () => {
  let component: SimuladorExternoComponent;
  let fixture: ComponentFixture<SimuladorExternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimuladorExternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuladorExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
