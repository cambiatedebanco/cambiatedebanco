import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpffCreditoComponent } from './ppff-credito.component';

describe('PpffCreditoComponent', () => {
  let component: PpffCreditoComponent;
  let fixture: ComponentFixture<PpffCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpffCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpffCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
