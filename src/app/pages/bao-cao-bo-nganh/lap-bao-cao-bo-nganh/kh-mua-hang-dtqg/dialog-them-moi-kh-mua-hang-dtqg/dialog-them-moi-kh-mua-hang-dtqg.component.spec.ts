import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiKhMuaHangDtqgComponent } from './dialog-them-moi-kh-mua-hang-dtqg.component';

describe('DialogThemMoiKhMuaHangDtqgComponent', () => {
  let component: DialogThemMoiKhMuaHangDtqgComponent;
  let fixture: ComponentFixture<DialogThemMoiKhMuaHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiKhMuaHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogThemMoiKhMuaHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
