import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent } from './thong-tin-de-xuat-ke-hoach-sua-chua-thuong-xuyen.component';

describe('ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent', () => {
  let component: ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent;
  let fixture: ComponentFixture<ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinDeXuatKeHoachSuaChuaThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
