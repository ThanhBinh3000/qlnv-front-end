import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangKeCanHangComponent } from './bang-ke-can-hang.component';

describe('BangKeCanHangComponent', () => {
  let component: BangKeCanHangComponent;
  let fixture: ComponentFixture<BangKeCanHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangKeCanHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BangKeCanHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
