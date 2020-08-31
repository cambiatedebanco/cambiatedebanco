import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfSeguroComponent } from './oferta-af-seguro.component';

describe('OfertaAfSeguroComponent', () => {
  let component: OfertaAfSeguroComponent;
  let fixture: ComponentFixture<OfertaAfSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
