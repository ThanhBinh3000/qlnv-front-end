import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiKhMuaHangDtqgComponent } from './them-moi-kh-mua-hang-dtqg.component';

describe('ThemMoiKhMuaHangDtqgComponent', () => {
  let component: ThemMoiKhMuaHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiKhMuaHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiKhMuaHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiKhMuaHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
