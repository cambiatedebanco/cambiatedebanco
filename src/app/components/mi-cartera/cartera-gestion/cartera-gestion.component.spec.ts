import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraGestionComponent } from './cartera-gestion.component';

describe('CarteraGestionComponent', () => {
  let component: CarteraGestionComponent;
  let fixture: ComponentFixture<CarteraGestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraGestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
