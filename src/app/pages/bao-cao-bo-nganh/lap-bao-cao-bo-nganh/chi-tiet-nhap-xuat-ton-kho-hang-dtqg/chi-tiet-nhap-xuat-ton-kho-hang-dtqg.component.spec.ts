import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNhapXuatTonKhoHangDtqgComponent } from './chi-tiet-nhap-xuat-ton-kho-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: ChiTietNhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<ChiTietNhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
