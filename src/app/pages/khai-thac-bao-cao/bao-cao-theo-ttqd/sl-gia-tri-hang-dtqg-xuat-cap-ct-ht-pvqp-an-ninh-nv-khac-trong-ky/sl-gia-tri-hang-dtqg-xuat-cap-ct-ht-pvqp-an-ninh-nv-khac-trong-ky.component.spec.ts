import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent } from './sl-gia-tri-hang-dtqg-xuat-cap-ct-ht-pvqp-an-ninh-nv-khac-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgXuatCapCtHtPvqpAnNinhNvKhacTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
