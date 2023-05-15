import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiKhNhapXuatCtVtBqHangDtqgComponent } from './them-moi-kh-nhap-xuat-ct-vt-bq-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiKhNhapXuatCtVtBqHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiKhNhapXuatCtVtBqHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiKhNhapXuatCtVtBqHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiKhNhapXuatCtVtBqHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
