import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanChuanBiKhoComponent } from './bien-ban-chuan-bi-kho.component';

describe('BienBanChuanBiKhoComponent', () => {
  let component: BienBanChuanBiKhoComponent;
  let fixture: ComponentFixture<BienBanChuanBiKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanChuanBiKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanChuanBiKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
