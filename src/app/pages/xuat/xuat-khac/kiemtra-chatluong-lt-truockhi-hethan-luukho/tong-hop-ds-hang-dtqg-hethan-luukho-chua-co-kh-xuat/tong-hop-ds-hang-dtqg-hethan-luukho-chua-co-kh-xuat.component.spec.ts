import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent } from './tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component';

describe('TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent', () => {
  let component: TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent;
  let fixture: ComponentFixture<TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
