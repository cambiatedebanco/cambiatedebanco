import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketChatFormComponent } from './ticket-chat-form.component';

describe('TicketChatFormComponent', () => {
  let component: TicketChatFormComponent;
  let fixture: ComponentFixture<TicketChatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketChatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
