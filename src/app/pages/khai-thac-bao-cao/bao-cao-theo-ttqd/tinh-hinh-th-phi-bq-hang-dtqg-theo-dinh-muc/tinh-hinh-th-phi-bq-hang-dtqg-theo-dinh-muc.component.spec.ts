import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinhHinhThPhiBqHangDtqgTheoDinhMucComponent } from './tinh-hinh-th-phi-bq-hang-dtqg-theo-dinh-muc.component';

describe('CtNhapXuatTonKhoHangDtqgComponent', () => {
  let component: TinhHinhThPhiBqHangDtqgTheoDinhMucComponent;
  let fixture: ComponentFixture<TinhHinhThPhiBqHangDtqgTheoDinhMucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinhHinhThPhiBqHangDtqgTheoDinhMucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinhHinhThPhiBqHangDtqgTheoDinhMucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
