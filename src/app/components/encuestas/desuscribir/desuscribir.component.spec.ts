import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesuscribirComponent } from './desuscribir.component';

describe('DesuscribirComponent', () => {
  let component: DesuscribirComponent;
  let fixture: ComponentFixture<DesuscribirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesuscribirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesuscribirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
