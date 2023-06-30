import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiemTraChatLuongMenuComponent } from './kiem-tra-chat-luong-menu.component';

describe('KiemTraChatLuongMenuComponent', () => {
  let component: KiemTraChatLuongMenuComponent;
  let fixture: ComponentFixture<KiemTraChatLuongMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiemTraChatLuongMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KiemTraChatLuongMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
