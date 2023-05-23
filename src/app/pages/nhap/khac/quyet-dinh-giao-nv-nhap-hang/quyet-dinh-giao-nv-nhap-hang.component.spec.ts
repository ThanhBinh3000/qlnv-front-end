import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuyetDinhGiaoNvNhapHangComponent } from './quyet-dinh-giao-nv-nhap-hang.component';

describe('QuyetDinhGiaoNvNhapHangComponent', () => {
  let component: QuyetDinhGiaoNvNhapHangComponent;
  let fixture: ComponentFixture<QuyetDinhGiaoNvNhapHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuyetDinhGiaoNvNhapHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuyetDinhGiaoNvNhapHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
