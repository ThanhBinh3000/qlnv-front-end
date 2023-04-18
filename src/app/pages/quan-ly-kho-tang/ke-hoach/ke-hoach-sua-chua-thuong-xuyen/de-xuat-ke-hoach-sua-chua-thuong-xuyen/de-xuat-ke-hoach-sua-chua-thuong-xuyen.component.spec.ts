import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatKeHoachSuaChuaThuongXuyenComponent } from './de-xuat-ke-hoach-sua-chua-thuong-xuyen.component';

describe('DeXuatKeHoachSuaChuaThuongXuyenComponent', () => {
  let component: DeXuatKeHoachSuaChuaThuongXuyenComponent;
  let fixture: ComponentFixture<DeXuatKeHoachSuaChuaThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatKeHoachSuaChuaThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatKeHoachSuaChuaThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
