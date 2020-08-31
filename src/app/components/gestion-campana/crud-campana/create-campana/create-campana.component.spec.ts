import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCampanaComponent } from './create-campana.component';

describe('CreateCampanaComponent', () => {
  let component: CreateCampanaComponent;
  let fixture: ComponentFixture<CreateCampanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCampanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCampanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
