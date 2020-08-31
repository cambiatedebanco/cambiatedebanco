import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfiliadoDemograficoComponent } from './afiliado-demografico.component';

describe('AfiliadoDemograficoComponent', () => {
  let component: AfiliadoDemograficoComponent;
  let fixture: ComponentFixture<AfiliadoDemograficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfiliadoDemograficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfiliadoDemograficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
