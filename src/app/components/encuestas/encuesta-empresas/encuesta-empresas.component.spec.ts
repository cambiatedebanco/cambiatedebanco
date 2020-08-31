import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaEmpresasComponent } from './encuesta-empresas.component';

describe('EncuestaEmpresasComponent', () => {
  let component: EncuestaEmpresasComponent;
  let fixture: ComponentFixture<EncuestaEmpresasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaEmpresasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
