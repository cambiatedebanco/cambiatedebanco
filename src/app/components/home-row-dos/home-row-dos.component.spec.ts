import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRowDosComponent } from './home-row-dos.component';

describe('HomeRowDosComponent', () => {
  let component: HomeRowDosComponent;
  let fixture: ComponentFixture<HomeRowDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRowDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRowDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
