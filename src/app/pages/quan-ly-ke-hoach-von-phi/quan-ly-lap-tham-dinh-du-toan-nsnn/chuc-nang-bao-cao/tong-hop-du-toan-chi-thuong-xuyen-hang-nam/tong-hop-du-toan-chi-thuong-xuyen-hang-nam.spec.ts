import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDuToanChiThuongXuyenHangNamComponent } from './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component';

describe('NhuCauNhapXuatHangDtqgNamComponent', () => {
  let component: TongHopDuToanChiThuongXuyenHangNamComponent;
  let fixture: ComponentFixture<TongHopDuToanChiThuongXuyenHangNamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDuToanChiThuongXuyenHangNamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDuToanChiThuongXuyenHangNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
