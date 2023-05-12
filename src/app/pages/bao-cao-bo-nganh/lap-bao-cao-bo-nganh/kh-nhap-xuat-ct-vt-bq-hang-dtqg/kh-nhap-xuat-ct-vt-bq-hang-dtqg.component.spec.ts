import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhNhapXuatCtVtBqHangDtqgComponent } from './kh-nhap-xuat-ct-vt-bq-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: KhNhapXuatCtVtBqHangDtqgComponent;
  let fixture: ComponentFixture<KhNhapXuatCtVtBqHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhNhapXuatCtVtBqHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhNhapXuatCtVtBqHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
