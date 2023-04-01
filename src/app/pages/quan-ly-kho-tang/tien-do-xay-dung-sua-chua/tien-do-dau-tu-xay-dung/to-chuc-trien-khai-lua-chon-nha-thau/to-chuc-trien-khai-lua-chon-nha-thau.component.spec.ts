import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToChucTrienKhaiLuaChonNhaThauComponent } from './to-chuc-trien-khai-lua-chon-nha-thau.component';

describe('ToChucTrienKhaiLuaChonNhaThauComponent', () => {
  let component: ToChucTrienKhaiLuaChonNhaThauComponent;
  let fixture: ComponentFixture<ToChucTrienKhaiLuaChonNhaThauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToChucTrienKhaiLuaChonNhaThauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToChucTrienKhaiLuaChonNhaThauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
