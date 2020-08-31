import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSimulacionWebComponent } from './admin-simulacion-web.component';

describe('AdminSimulacionWebComponent', () => {
  let component: AdminSimulacionWebComponent;
  let fixture: ComponentFixture<AdminSimulacionWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSimulacionWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSimulacionWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
