import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiTietNhuCauChiThuongXuyen3NamComponent } from './chi-tiet-nhu-cau-chi-thuong-xuyen-3-nam.component';

describe('ChiTietNhuCauChiThuongXuyen3NamComponent', () => {
  let component: ChiTietNhuCauChiThuongXuyen3NamComponent;
  let fixture: ComponentFixture<ChiTietNhuCauChiThuongXuyen3NamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiTietNhuCauChiThuongXuyen3NamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChiTietNhuCauChiThuongXuyen3NamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
