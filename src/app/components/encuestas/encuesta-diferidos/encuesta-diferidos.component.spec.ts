import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaDiferidosComponent } from './encuesta-diferidos.component';

describe('EncuestaDiferidosComponent', () => {
  let component: EncuestaDiferidosComponent;
  let fixture: ComponentFixture<EncuestaDiferidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestaDiferidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaDiferidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
