import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReferidosPensionadosComponent } from './form-referidos-pensionados.component';

describe('FormReferidosPensionadosComponent', () => {
  let component: FormReferidosPensionadosComponent;
  let fixture: ComponentFixture<FormReferidosPensionadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReferidosPensionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReferidosPensionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
