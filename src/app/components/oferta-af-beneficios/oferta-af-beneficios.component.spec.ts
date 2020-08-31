import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfBeneficiosComponent } from './oferta-af-beneficios.component';

describe('OfertaAfBeneficiosComponent', () => {
  let component: OfertaAfBeneficiosComponent;
  let fixture: ComponentFixture<OfertaAfBeneficiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfBeneficiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfBeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
