import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachHangDtqgComponent } from './danh-sach-hang-dtqg.component';

describe('DanhSachHangDtqgComponent', () => {
  let component: DanhSachHangDtqgComponent;
  let fixture: ComponentFixture<DanhSachHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
