import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAtmComponent } from './home-atm.component';

describe('HomeAtmComponent', () => {
  let component: HomeAtmComponent;
  let fixture: ComponentFixture<HomeAtmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeAtmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
