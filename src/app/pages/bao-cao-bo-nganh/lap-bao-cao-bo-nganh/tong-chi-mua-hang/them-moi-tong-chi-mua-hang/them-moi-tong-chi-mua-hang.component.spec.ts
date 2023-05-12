import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiTongChiMuaHangComponent } from './them-moi-tong-chi-mua-hang.component';

describe('ThemMoiTongChiMuaHangComponent', () => {
  let component: ThemMoiTongChiMuaHangComponent;
  let fixture: ComponentFixture<ThemMoiTongChiMuaHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiTongChiMuaHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiTongChiMuaHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
