import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienBanGiaoNhanPvcComponent } from './bien-ban-giao-nhan-pvc.component';

describe('BienBanGiaoNhanPvcComponent', () => {
  let component: BienBanGiaoNhanPvcComponent;
  let fixture: ComponentFixture<BienBanGiaoNhanPvcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienBanGiaoNhanPvcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BienBanGiaoNhanPvcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
