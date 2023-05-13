import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiamHangDtqgComponent } from './giam-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: GiamHangDtqgComponent;
  let fixture: ComponentFixture<GiamHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiamHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiamHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
