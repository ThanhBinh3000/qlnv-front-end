import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTongHopNhapXuatComponent } from './kh-tong-hop-nhap-xuat.component';

describe('KhTongHopNhapXuatComponent', () => {
  let component: KhTongHopNhapXuatComponent;
  let fixture: ComponentFixture<KhTongHopNhapXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTongHopNhapXuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTongHopNhapXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
