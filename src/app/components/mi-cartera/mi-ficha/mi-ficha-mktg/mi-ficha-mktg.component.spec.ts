import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiFichaMktgComponent } from './mi-ficha-mktg.component';

describe('MiFichaMktgComponent', () => {
  let component: MiFichaMktgComponent;
  let fixture: ComponentFixture<MiFichaMktgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiFichaMktgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiFichaMktgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
