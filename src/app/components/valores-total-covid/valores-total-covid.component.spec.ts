import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValoresTotalCovidComponent } from './valores-total-covid.component';

describe('ValoresTotalCovidComponent', () => {
  let component: ValoresTotalCovidComponent;
  let fixture: ComponentFixture<ValoresTotalCovidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValoresTotalCovidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValoresTotalCovidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
