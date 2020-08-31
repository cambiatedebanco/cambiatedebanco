import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfAprobprecalComponent } from './oferta-af-aprobprecal.component';

describe('OfertaAfAprobprecalComponent', () => {
  let component: OfertaAfAprobprecalComponent;
  let fixture: ComponentFixture<OfertaAfAprobprecalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfAprobprecalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfAprobprecalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
