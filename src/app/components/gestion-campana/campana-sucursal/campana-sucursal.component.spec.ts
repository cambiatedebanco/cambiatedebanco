import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampanaSucursalComponent } from './campana-sucursal.component';

describe('CampanaSucursalComponent', () => {
  let component: CampanaSucursalComponent;
  let fixture: ComponentFixture<CampanaSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampanaSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampanaSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
