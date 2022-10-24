import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent } from './tong-hop-muc-tieu-nhiem-vu-chu-yeu-va-nhu-cau-chi-moi-3-nam.component';

describe('TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent', () => {
  let component: TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent;
  let fixture: ComponentFixture<TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopMucTieuNhiemVuChuYeuVaNhuCauChiMoi3NamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
