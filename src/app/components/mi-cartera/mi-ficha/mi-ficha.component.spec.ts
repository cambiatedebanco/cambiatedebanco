import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiFichaComponent } from './mi-ficha.component';

describe('MiFichaComponent', () => {
  let component: MiFichaComponent;
  let fixture: ComponentFixture<MiFichaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiFichaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
