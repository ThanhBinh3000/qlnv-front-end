import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiTiepNhanHangDtqgComponent } from './them-moi-tiep-nhan-hang-dtqg.component';

describe('ThemMoiTiepNhanHangDtqgComponent', () => {
  let component: ThemMoiTiepNhanHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiTiepNhanHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiTiepNhanHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiTiepNhanHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
