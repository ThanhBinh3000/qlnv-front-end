import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent } from './tn-sd-hang-dtqg-xuat-ct-qp-an-nhiem-vu-khac-duoc-giao-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent;
  let fixture: ComponentFixture<TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TnSdHangDtqgXuatCtQpAnNhiemVuKhacDuocGiaoTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
