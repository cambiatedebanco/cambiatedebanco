import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionConfirmedComponent } from './region-confirmed.component';

describe('RegionConfirmedComponent', () => {
  let component: RegionConfirmedComponent;
  let fixture: ComponentFixture<RegionConfirmedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
