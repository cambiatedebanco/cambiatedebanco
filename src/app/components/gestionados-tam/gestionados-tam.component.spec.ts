import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionadosTamComponent } from './gestionados-tam.component';

describe('GestionadosTamComponent', () => {
  let component: GestionadosTamComponent;
  let fixture: ComponentFixture<GestionadosTamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionadosTamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionadosTamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
