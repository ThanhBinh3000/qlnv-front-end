import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongChiMuaHangComponent } from './tong-chi-mua-hang.component';

describe('TongChiMuaHangComponent', () => {
  let component: TongChiMuaHangComponent;
  let fixture: ComponentFixture<TongChiMuaHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongChiMuaHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongChiMuaHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
