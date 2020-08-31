import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEsperaComponent } from './ticket-espera.component';

describe('TicketEsperaComponent', () => {
  let component: TicketEsperaComponent;
  let fixture: ComponentFixture<TicketEsperaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEsperaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEsperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
