import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhapXuatTonKhoHangDtqgComponent } from './nhap-xuat-ton-kho-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: NhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<NhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
