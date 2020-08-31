import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaDemograficoComponent } from './empresa-demografico.component';

describe('EmpresaDemograficoComponent', () => {
  let component: EmpresaDemograficoComponent;
  let fixture: ComponentFixture<EmpresaDemograficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaDemograficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaDemograficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
