import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong.component';

describe('PhieuKiemNghiemChatLuongComponent', () => {
  let component: PhieuKiemNghiemChatLuongComponent;
  let fixture: ComponentFixture<PhieuKiemNghiemChatLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhieuKiemNghiemChatLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieuKiemNghiemChatLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
