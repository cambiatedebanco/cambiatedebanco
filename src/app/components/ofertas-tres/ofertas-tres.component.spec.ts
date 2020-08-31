import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasTresComponent } from './ofertas-tres.component';

describe('OfertasTresComponent', () => {
  let component: OfertasTresComponent;
  let fixture: ComponentFixture<OfertasTresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertasTresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertasTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
