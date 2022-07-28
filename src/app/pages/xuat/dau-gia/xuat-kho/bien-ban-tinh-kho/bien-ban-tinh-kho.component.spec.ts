import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanTinhKhoComponent } from './bien-ban-tinh-kho.component';

describe('BienBanTinhKhoComponent', () => {
  let component: BienBanTinhKhoComponent;
  let fixture: ComponentFixture<BienBanTinhKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanTinhKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanTinhKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
