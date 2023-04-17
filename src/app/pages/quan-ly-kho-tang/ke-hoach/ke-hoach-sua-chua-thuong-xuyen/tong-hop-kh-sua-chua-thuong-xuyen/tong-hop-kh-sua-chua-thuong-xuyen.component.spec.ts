import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopKhSuaChuaThuongXuyenComponent } from './tong-hop-kh-sua-chua-thuong-xuyen.component';

describe('TongHopKhSuaChuaThuongXuyenComponent', () => {
  let component: TongHopKhSuaChuaThuongXuyenComponent;
  let fixture: ComponentFixture<TongHopKhSuaChuaThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopKhSuaChuaThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopKhSuaChuaThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
