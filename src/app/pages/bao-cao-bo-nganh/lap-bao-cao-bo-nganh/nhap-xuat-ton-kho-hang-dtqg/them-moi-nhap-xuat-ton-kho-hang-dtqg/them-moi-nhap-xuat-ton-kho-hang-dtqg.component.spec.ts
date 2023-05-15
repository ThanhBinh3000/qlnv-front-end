import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiNhapXuatTonKhoHangDtqgComponent } from './them-moi-nhap-xuat-ton-kho-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiNhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiNhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiNhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiNhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
