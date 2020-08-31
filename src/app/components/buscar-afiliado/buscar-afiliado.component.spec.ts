import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAfiliadoComponent } from './buscar-afiliado.component';

describe('BuscarAfiliadoComponent', () => {
  let component: BuscarAfiliadoComponent;
  let fixture: ComponentFixture<BuscarAfiliadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarAfiliadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
