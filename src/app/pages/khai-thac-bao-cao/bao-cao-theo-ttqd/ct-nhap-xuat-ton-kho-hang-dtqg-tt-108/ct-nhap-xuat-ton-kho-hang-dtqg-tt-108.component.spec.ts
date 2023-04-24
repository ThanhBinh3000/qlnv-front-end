import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtNhapXuatTonKhoHangDtqgTt108Component } from './ct-nhap-xuat-ton-kho-hang-dtqg-tt-108.component';

describe('CtNhapXuatTonKhoHangDtqgComponent', () => {
  let component: CtNhapXuatTonKhoHangDtqgTt108Component;
  let fixture: ComponentFixture<CtNhapXuatTonKhoHangDtqgTt108Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtNhapXuatTonKhoHangDtqgTt108Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtNhapXuatTonKhoHangDtqgTt108Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
