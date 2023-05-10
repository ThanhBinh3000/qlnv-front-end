import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiGiamHangDtqgComponent } from './them-moi-giam-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiGiamHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiGiamHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiGiamHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiGiamHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
