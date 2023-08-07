import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent } from './danh-sach-hang-du-tru-trong-kho-ngoai-danh-muc.component';

describe('DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent', () => {
  let component: DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent;
  let fixture: ComponentFixture<DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachHangDuTruTrongKhoNgoaiDanhMucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
