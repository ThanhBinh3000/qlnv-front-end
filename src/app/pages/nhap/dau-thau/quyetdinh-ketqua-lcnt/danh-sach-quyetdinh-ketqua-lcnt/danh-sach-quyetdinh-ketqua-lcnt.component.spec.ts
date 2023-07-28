import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhSachQuyetdinhKetquaLcntComponent } from './danh-sach-quyetdinh-ketqua-lcnt.component';

describe('DanhSachQuyetdinhKetquaLcntComponent', () => {
  let component: DanhSachQuyetdinhKetquaLcntComponent;
  let fixture: ComponentFixture<DanhSachQuyetdinhKetquaLcntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanhSachQuyetdinhKetquaLcntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachQuyetdinhKetquaLcntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
