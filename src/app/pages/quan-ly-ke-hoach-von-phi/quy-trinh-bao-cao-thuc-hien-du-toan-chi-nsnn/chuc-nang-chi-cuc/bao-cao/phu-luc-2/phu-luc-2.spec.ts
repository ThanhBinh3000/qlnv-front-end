import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuLucIIComponent } from './phu-luc-2.component';

describe('PhuLucIIComponent', () => {
  let component: PhuLucIIComponent;
  let fixture: ComponentFixture<PhuLucIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhuLucIIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLucIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
