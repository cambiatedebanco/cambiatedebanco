import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAutoFullComponent } from './form-auto-full.component';

describe('FormAutoFullComponent', () => {
  let component: FormAutoFullComponent;
  let fixture: ComponentFixture<FormAutoFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAutoFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAutoFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
