import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgXuatTrongKyComponent } from './sl-gia-tri-hang-dtqg-xuat-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgXuatTrongKyComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgXuatTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgXuatTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgXuatTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
