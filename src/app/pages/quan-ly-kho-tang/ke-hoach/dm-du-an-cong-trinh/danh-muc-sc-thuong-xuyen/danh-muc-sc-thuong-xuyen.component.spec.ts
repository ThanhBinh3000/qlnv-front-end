import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhMucScThuongXuyenComponent } from './danh-muc-sc-thuong-xuyen.component';

describe('DanhMucScThuongXuyenComponent', () => {
  let component: DanhMucScThuongXuyenComponent;
  let fixture: ComponentFixture<DanhMucScThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhMucScThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhMucScThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
