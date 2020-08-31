import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSocioComponent } from './create-socio.component';

describe('CreateSocioComponent', () => {
  let component: CreateSocioComponent;
  let fixture: ComponentFixture<CreateSocioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSocioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
