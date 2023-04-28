import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinTongHopKhSuaChuaThuongXuyenComponent } from './thong-tin-tong-hop-kh-sua-chua-thuong-xuyen.component';

describe('ThongTinTongHopKhSuaChuaThuongXuyenComponent', () => {
  let component: ThongTinTongHopKhSuaChuaThuongXuyenComponent;
  let fixture: ComponentFixture<ThongTinTongHopKhSuaChuaThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinTongHopKhSuaChuaThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinTongHopKhSuaChuaThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
