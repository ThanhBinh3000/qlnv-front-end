import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan.component';

describe('LapBienBanNghiemThuBaoQuanComponent', () => {
  let component: LapBienBanNghiemThuBaoQuanComponent;
  let fixture: ComponentFixture<LapBienBanNghiemThuBaoQuanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LapBienBanNghiemThuBaoQuanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LapBienBanNghiemThuBaoQuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
