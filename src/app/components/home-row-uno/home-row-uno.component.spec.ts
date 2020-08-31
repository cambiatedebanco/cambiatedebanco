import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRowUnoComponent } from './home-row-uno.component';

describe('HomeRowUnoComponent', () => {
  let component: HomeRowUnoComponent;
  let fixture: ComponentFixture<HomeRowUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRowUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRowUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
