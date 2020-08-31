import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAgenteComponent } from './gestion-agente.component';

describe('GestionAgenteComponent', () => {
  let component: GestionAgenteComponent;
  let fixture: ComponentFixture<GestionAgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionAgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
