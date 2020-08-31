import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasDosComponent } from './ofertas-dos.component';

describe('OfertasDosComponent', () => {
  let component: OfertasDosComponent;
  let fixture: ComponentFixture<OfertasDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertasDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertasDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
