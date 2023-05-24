import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent } from './dialog-them-moi-chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component';

describe('DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent', () => {
  let component: DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogThemMoiChiTietNhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
