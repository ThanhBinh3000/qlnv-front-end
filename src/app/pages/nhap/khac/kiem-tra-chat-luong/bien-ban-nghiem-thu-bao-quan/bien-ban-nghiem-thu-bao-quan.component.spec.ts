import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan.component';

describe('BienBanNghiemThuBaoQuanComponent', () => {
  let component: BienBanNghiemThuBaoQuanComponent;
  let fixture: ComponentFixture<BienBanNghiemThuBaoQuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanNghiemThuBaoQuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanNghiemThuBaoQuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
