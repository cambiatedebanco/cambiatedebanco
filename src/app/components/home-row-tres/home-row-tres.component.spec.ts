import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRowTresComponent } from './home-row-tres.component';

describe('HomeRowTresComponent', () => {
  let component: HomeRowTresComponent;
  let fixture: ComponentFixture<HomeRowTresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRowTresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRowTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
