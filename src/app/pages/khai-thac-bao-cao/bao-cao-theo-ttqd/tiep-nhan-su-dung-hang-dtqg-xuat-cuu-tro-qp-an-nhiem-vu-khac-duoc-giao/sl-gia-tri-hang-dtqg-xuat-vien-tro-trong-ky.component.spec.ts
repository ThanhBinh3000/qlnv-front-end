import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgXuatVienTroTrongKyComponent } from './sl-gia-tri-hang-dtqg-xuat-vien-tro-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgXuatVienTroTrongKyComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgXuatVienTroTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgXuatVienTroTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgXuatVienTroTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
