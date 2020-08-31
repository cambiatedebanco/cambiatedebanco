import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainGestionCampanaComponent } from './main-gestion-campana.component';

describe('MainGestionCampanaComponent', () => {
  let component: MainGestionCampanaComponent;
  let fixture: ComponentFixture<MainGestionCampanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainGestionCampanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainGestionCampanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
