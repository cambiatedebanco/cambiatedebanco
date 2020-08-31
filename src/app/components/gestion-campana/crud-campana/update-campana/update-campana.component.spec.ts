import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCampanaComponent } from './update-campana.component';

describe('UpdateCampanaComponent', () => {
  let component: UpdateCampanaComponent;
  let fixture: ComponentFixture<UpdateCampanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCampanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCampanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
