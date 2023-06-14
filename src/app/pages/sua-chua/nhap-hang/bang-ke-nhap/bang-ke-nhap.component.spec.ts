import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BangKeNhapComponent } from './bang-ke-nhap.component';

describe('BangKeNhapComponent', () => {
  let component: BangKeNhapComponent;
  let fixture: ComponentFixture<BangKeNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BangKeNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BangKeNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
