import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';

describe('KiemTraChatLuongComponent', () => {
  let component: KiemTraChatLuongComponent;
  let fixture: ComponentFixture<KiemTraChatLuongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiemTraChatLuongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiemTraChatLuongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
