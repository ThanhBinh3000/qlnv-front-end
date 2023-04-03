import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThBcSoLuongClMayMocThietBiChuyenDungComponent } from './th-bc-so-luong-cl-may-moc-thiet-bi-chuyen-dung.component';

describe('KhTangHangDtqgComponent', () => {
  let component: ThBcSoLuongClMayMocThietBiChuyenDungComponent;
  let fixture: ComponentFixture<ThBcSoLuongClMayMocThietBiChuyenDungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThBcSoLuongClMayMocThietBiChuyenDungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThBcSoLuongClMayMocThietBiChuyenDungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
