import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent } from './th-phi-nhap-xuat-phi-xuat-vien-tro-cuu-ho-ht-hang-dtqg.component';

describe('CtNhapXuatTonKhoHangDtqgComponent', () => {
  let component: ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent;
  let fixture: ComponentFixture<ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThPhiNhapXuatPhiXuatVienTroCuuHoHtHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
