import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuLucIComponent } from './phu-luc-1.component';

describe('PhuLucIComponent', () => {
  let component: PhuLucIComponent;
  let fixture: ComponentFixture<PhuLucIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhuLucIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLucIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
