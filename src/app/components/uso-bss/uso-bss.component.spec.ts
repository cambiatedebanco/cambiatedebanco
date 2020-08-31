import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoBssComponent } from './uso-bss.component';

describe('UsoBssComponent', () => {
  let component: UsoBssComponent;
  let fixture: ComponentFixture<UsoBssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsoBssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsoBssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
