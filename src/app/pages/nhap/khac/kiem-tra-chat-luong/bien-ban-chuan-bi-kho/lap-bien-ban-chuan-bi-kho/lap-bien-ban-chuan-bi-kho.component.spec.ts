import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapBienBanChuanBiKhoComponent } from './lap-bien-ban-chuan-bi-kho.component';

describe('LapBienBanChuanBiKhoComponent', () => {
  let component: LapBienBanChuanBiKhoComponent;
  let fixture: ComponentFixture<LapBienBanChuanBiKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LapBienBanChuanBiKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LapBienBanChuanBiKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
