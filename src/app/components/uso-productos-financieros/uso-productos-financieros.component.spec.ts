import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoProductosFinancierosComponent } from './uso-productos-financieros.component';

describe('UsoProductosFinancierosComponent', () => {
  let component: UsoProductosFinancierosComponent;
  let fixture: ComponentFixture<UsoProductosFinancierosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsoProductosFinancierosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsoProductosFinancierosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
