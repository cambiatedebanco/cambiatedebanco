import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginExtComponent } from './login-ext.component';

describe('LoginExtComponent', () => {
  let component: LoginExtComponent;
  let fixture: ComponentFixture<LoginExtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginExtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
