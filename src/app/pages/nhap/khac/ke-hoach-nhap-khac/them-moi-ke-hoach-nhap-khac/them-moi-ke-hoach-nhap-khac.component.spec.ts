import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiKeHoachNhapKhacComponent } from './them-moi-ke-hoach-nhap-khac.component';

describe('ThemMoiKeHoachNhapKhacComponent', () => {
  let component: ThemMoiKeHoachNhapKhacComponent;
  let fixture: ComponentFixture<ThemMoiKeHoachNhapKhacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiKeHoachNhapKhacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiKeHoachNhapKhacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
