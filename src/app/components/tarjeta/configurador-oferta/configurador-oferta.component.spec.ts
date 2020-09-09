import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguradorOfertaComponent } from './configurador-oferta.component';

describe('ConfiguradorOfertaComponent', () => {
  let component: ConfiguradorOfertaComponent;
  let fixture: ComponentFixture<ConfiguradorOfertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguradorOfertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguradorOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
