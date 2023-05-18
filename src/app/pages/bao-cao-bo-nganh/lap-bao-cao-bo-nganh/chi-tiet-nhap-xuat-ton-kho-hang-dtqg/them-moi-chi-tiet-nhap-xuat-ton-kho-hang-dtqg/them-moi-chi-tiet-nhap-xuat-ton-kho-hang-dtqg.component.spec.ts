import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent } from './them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiChiTietNhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
