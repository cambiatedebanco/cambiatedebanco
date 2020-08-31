import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpffAhorroComponent } from './ppff-ahorro.component';

describe('PpffAhorroComponent', () => {
  let component: PpffAhorroComponent;
  let fixture: ComponentFixture<PpffAhorroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpffAhorroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpffAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
