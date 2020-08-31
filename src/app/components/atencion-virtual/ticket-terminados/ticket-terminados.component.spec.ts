import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTerminadosComponent } from './ticket-terminados.component';

describe('TicketTerminadosComponent', () => {
  let component: TicketTerminadosComponent;
  let fixture: ComponentFixture<TicketTerminadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTerminadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTerminadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
