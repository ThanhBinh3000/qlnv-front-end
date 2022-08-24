import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopNhuCauChiThuongXuyen3NamComponent } from './tong-hop-nhu-cau-chi-thuong-xuyen-3-nam.component';

describe('TongHopNhuCauChiThuongXuyen3NamComponent', () => {
  let component: TongHopNhuCauChiThuongXuyen3NamComponent;
  let fixture: ComponentFixture<TongHopNhuCauChiThuongXuyen3NamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopNhuCauChiThuongXuyen3NamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopNhuCauChiThuongXuyen3NamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
