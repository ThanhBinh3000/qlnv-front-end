import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanNghiemThuComponent } from './bien-ban-nghiem-thu.component';

describe('BienBanNghiemThuComponent', () => {
  let component: BienBanNghiemThuComponent;
  let fixture: ComponentFixture<BienBanNghiemThuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanNghiemThuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanNghiemThuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
