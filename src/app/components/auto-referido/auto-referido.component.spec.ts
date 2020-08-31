import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReferidoComponent } from './auto-referido.component';

describe('AutoReferidoComponent', () => {
  let component: AutoReferidoComponent;
  let fixture: ComponentFixture<AutoReferidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReferidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReferidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
