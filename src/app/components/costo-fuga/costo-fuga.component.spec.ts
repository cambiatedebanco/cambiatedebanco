import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostoFugaComponent } from './costo-fuga.component';

describe('CostoFugaComponent', () => {
  let component: CostoFugaComponent;
  let fixture: ComponentFixture<CostoFugaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostoFugaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostoFugaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
