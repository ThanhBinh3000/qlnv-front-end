import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongChiChoMuaHangDtqgTrongKyComponent } from './tong-chi-cho-mua-hang-dtqg-trong-ky.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: TongChiChoMuaHangDtqgTrongKyComponent;
  let fixture: ComponentFixture<TongChiChoMuaHangDtqgTrongKyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongChiChoMuaHangDtqgTrongKyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongChiChoMuaHangDtqgTrongKyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
