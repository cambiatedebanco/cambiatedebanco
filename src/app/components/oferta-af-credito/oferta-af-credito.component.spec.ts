import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfCreditoComponent } from './oferta-af-credito.component';

describe('OfertaAfCreditoComponent', () => {
  let component: OfertaAfCreditoComponent;
  let fixture: ComponentFixture<OfertaAfCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
