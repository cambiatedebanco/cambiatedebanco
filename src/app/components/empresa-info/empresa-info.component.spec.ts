import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaInfoComponent } from './empresa-info.component';

describe('EmpresaInfoComponent', () => {
  let component: EmpresaInfoComponent;
  let fixture: ComponentFixture<EmpresaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
