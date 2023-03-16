import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtNhapXuatTonKhoHangDtqgComponent } from './ct-nhap-xuat-ton-kho-hang-dtqg.component';

describe('CtNhapXuatTonKhoHangDtqgComponent', () => {
  let component: CtNhapXuatTonKhoHangDtqgComponent;
  let fixture: ComponentFixture<CtNhapXuatTonKhoHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtNhapXuatTonKhoHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtNhapXuatTonKhoHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
