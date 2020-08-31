import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSocioComponent } from './gestion-socio.component';

describe('GestionSocioComponent', () => {
  let component: GestionSocioComponent;
  let fixture: ComponentFixture<GestionSocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionSocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
