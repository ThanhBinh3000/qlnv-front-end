import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThopNhapXuatHangDTQGComponent } from './thop-nhap-xuat-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: ThopNhapXuatHangDTQGComponent;
  let fixture: ComponentFixture<ThopNhapXuatHangDTQGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThopNhapXuatHangDTQGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThopNhapXuatHangDTQGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
