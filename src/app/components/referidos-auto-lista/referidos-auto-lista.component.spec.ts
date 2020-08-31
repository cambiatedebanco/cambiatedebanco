import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferidosAutoListaComponent } from './referidos-auto-lista.component';

describe('ReferidosAutoListaComponent', () => {
  let component: ReferidosAutoListaComponent;
  let fixture: ComponentFixture<ReferidosAutoListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferidosAutoListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferidosAutoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
