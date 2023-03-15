import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent } from './sl-gia-tri-hang-dtqg-xuat-cap-khong-thu-tien-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgXuatCapKhongThuTienTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
