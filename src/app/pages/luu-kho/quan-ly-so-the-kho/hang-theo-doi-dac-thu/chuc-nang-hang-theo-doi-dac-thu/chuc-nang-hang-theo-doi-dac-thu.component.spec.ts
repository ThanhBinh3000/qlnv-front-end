import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChucNangHangTheoDoiDacThuComponent } from './chuc-nang-hang-theo-doi-dac-thu.component';

describe('ChucNangHangTheoDoiDacThuComponent', () => {
  let component: ChucNangHangTheoDoiDacThuComponent;
  let fixture: ComponentFixture<ChucNangHangTheoDoiDacThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChucNangHangTheoDoiDacThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChucNangHangTheoDoiDacThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
