import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChatHomeComponent } from './ticket-chat-home.component';

describe('TicketChatHomeComponent', () => {
  let component: TicketChatHomeComponent;
  let fixture: ComponentFixture<TicketChatHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketChatHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketChatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
