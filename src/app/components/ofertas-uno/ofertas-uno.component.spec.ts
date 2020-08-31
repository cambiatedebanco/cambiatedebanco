import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasUnoComponent } from './ofertas-uno.component';

describe('OfertasUnoComponent', () => {
  let component: OfertasUnoComponent;
  let fixture: ComponentFixture<OfertasUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertasUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertasUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
