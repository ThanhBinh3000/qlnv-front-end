import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent } from './dialog-chi-tiet-ke-hoach-giao-bo-nganh-ubtvqh-mua-bu-bo-sung.component';

describe('DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent', () => {
  let component: DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent;
  let fixture: ComponentFixture<DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChiTietKeHoachGiaoBoNganhUbtvqhMuaBuBoSungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
