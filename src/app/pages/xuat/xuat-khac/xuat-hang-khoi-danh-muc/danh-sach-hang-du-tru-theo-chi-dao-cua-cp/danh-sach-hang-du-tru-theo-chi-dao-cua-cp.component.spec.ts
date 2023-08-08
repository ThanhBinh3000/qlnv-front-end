import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachHangDuTruTheoChiDaoCuaCpComponent } from './danh-sach-hang-du-tru-theo-chi-dao-cua-cp.component';

describe('DanhSachHangDuTruTheoChiDaoCuaCpComponent', () => {
  let component: DanhSachHangDuTruTheoChiDaoCuaCpComponent;
  let fixture: ComponentFixture<DanhSachHangDuTruTheoChiDaoCuaCpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachHangDuTruTheoChiDaoCuaCpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachHangDuTruTheoChiDaoCuaCpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
