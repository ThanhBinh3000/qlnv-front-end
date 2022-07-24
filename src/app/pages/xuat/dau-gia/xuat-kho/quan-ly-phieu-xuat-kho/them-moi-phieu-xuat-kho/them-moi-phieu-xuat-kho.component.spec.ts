import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiPhieuXuatKhoComponent } from './them-moi-phieu-xuat-kho.component';

describe('ThemMoiPhieuXuatKhoComponent', () => {
  let component: ThemMoiPhieuXuatKhoComponent;
  let fixture: ComponentFixture<ThemMoiPhieuXuatKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiPhieuXuatKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiPhieuXuatKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
