import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyPhieuXuatKhoComponent } from './quan-ly-phieu-xuat-kho.component';

describe('QuanLyPhieuXuatKhoComponent', () => {
  let component: QuanLyPhieuXuatKhoComponent;
  let fixture: ComponentFixture<QuanLyPhieuXuatKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuanLyPhieuXuatKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanLyPhieuXuatKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
