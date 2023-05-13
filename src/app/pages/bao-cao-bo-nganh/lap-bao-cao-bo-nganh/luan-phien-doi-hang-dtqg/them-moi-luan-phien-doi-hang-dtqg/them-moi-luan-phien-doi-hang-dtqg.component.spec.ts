import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiLuanPhienDoiHangDtqgComponent } from './them-moi-luan-phien-doi-hang-dtqg.component';

describe('ThemMoiNguonHinhThanhDtqgComponent', () => {
  let component: ThemMoiLuanPhienDoiHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiLuanPhienDoiHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiLuanPhienDoiHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiLuanPhienDoiHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
