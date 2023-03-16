import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgNhapTrongKyComponent } from './sl-gia-tri-hang-dtqg-nhap-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgNhapTrongKyComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgNhapTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgNhapTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgNhapTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
