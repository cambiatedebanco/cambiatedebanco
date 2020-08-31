import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpffSeguroComponent } from './ppff-seguro.component';

describe('PpffSeguroComponent', () => {
  let component: PpffSeguroComponent;
  let fixture: ComponentFixture<PpffSeguroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpffSeguroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpffSeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
