import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent } from './tong-hop-danh-sach-hang-dtqg-thuoc-dien-xuat-khoi-dm.component';

describe('TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent', () => {
  let component: TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent;
  let fixture: ComponentFixture<TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDanhSachHangDtqgThuocDienXuatKhoiDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
