import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiTangHangDtqgComponent } from './them-moi-tang-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiTangHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiTangHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiTangHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiTangHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
