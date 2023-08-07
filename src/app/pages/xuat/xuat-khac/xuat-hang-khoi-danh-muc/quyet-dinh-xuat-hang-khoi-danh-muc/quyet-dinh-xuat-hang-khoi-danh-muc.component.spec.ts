import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhXuatHangKhoiDanhMucComponent } from './quyet-dinh-xuat-hang-khoi-danh-muc.component';

describe('QuyetDinhXuatHangKhoiDanhMucComponent', () => {
  let component: QuyetDinhXuatHangKhoiDanhMucComponent;
  let fixture: ComponentFixture<QuyetDinhXuatHangKhoiDanhMucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhXuatHangKhoiDanhMucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhXuatHangKhoiDanhMucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
