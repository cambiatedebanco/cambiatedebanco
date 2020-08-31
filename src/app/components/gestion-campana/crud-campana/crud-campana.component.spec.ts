import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCampanaComponent } from './crud-campana.component';

describe('CrudCampanaComponent', () => {
  let component: CrudCampanaComponent;
  let fixture: ComponentFixture<CrudCampanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCampanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCampanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
