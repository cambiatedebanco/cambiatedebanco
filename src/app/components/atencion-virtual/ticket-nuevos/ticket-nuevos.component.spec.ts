import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketNuevosComponent } from './ticket-nuevos.component';

describe('TicketNuevosComponent', () => {
  let component: TicketNuevosComponent;
  let fixture: ComponentFixture<TicketNuevosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketNuevosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketNuevosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
