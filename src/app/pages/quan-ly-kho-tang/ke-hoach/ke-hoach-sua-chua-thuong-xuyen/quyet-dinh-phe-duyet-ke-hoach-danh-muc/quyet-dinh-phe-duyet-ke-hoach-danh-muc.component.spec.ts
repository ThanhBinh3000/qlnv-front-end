import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhPheDuyetKeHoachDanhMucComponent } from './quyet-dinh-phe-duyet-ke-hoach-danh-muc.component';

describe('QuyetDinhPheDuyetKeHoachDanhMucComponent', () => {
  let component: QuyetDinhPheDuyetKeHoachDanhMucComponent;
  let fixture: ComponentFixture<QuyetDinhPheDuyetKeHoachDanhMucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhPheDuyetKeHoachDanhMucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhPheDuyetKeHoachDanhMucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
