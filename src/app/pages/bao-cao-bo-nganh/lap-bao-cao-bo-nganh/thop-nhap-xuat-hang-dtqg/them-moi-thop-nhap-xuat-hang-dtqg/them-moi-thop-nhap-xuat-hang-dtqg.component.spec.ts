import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiThopNhapXuatHangDtqgComponent } from './them-moi-thop-nhap-xuat-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiThopNhapXuatHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiThopNhapXuatHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiThopNhapXuatHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiThopNhapXuatHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
