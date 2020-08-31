import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfSeguroAutoComponent } from './oferta-af-seguro-auto.component';

describe('OfertaAfSeguroAutoComponent', () => {
  let component: OfertaAfSeguroAutoComponent;
  let fixture: ComponentFixture<OfertaAfSeguroAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfSeguroAutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfSeguroAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
