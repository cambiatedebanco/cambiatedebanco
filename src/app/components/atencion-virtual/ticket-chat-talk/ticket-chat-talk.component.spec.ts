import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChatTalkComponent } from './ticket-chat-talk.component';

describe('TicketChatTalkComponent', () => {
  let component: TicketChatTalkComponent;
  let fixture: ComponentFixture<TicketChatTalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketChatTalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketChatTalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
