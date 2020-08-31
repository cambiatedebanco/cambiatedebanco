import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraFichaAfiliadoComponent } from './cartera-ficha-afiliado.component';

describe('CarteraFichaAfiliadoComponent', () => {
  let component: CarteraFichaAfiliadoComponent;
  let fixture: ComponentFixture<CarteraFichaAfiliadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraFichaAfiliadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraFichaAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
