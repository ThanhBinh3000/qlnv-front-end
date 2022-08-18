import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuLucIIIComponent } from './phu-luc-3.component';

describe('PhuLucIIIComponent', () => {
  let component: PhuLucIIIComponent;
  let fixture: ComponentFixture<PhuLucIIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhuLucIIIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLucIIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
