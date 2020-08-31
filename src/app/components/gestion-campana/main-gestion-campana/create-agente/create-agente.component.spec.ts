import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgenteComponent } from './create-agente.component';

describe('CreateAgenteComponent', () => {
  let component: CreateAgenteComponent;
  let fixture: ComponentFixture<CreateAgenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAgenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
