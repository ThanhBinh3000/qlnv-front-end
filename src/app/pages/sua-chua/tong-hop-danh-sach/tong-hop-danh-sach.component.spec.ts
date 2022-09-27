import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDanhSachComponent } from './tong-hop-danh-sach.component';

describe('TongHopDanhSachComponent', () => {
  let component: TongHopDanhSachComponent;
  let fixture: ComponentFixture<TongHopDanhSachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDanhSachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDanhSachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
