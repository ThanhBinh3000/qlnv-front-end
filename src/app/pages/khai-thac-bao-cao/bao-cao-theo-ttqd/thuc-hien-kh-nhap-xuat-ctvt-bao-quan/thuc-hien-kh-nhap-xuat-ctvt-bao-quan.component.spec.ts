import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThucHienKhNhapXuatCtvtBaoQuanComponent } from './thuc-hien-kh-nhap-xuat-ctvt-bao-quan.component';

describe('ThucHienKhNhapXuatCtvtBaoQuanComponent', () => {
  let component: ThucHienKhNhapXuatCtvtBaoQuanComponent;
  let fixture: ComponentFixture<ThucHienKhNhapXuatCtvtBaoQuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThucHienKhNhapXuatCtvtBaoQuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThucHienKhNhapXuatCtvtBaoQuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
