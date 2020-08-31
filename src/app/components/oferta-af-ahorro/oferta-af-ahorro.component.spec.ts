import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAfAhorroComponent } from './oferta-af-ahorro.component';

describe('OfertaAfAhorroComponent', () => {
  let component: OfertaAfAhorroComponent;
  let fixture: ComponentFixture<OfertaAfAhorroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfertaAfAhorroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertaAfAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
