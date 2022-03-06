import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachVatTuHangHoaComponent } from './danh-sach-vat-tu-hang-hoa.component';

describe('DanhSachVatTuHangHoaComponent', () => {
  let component: DanhSachVatTuHangHoaComponent;
  let fixture: ComponentFixture<DanhSachVatTuHangHoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachVatTuHangHoaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachVatTuHangHoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
