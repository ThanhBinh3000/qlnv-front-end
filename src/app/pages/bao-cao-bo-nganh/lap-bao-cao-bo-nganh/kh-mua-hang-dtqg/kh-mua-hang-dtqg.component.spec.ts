import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhMuaHangDtqgComponent } from './kh-mua-hang-dtqg.component';

describe('KhMuaHangDtqgComponent', () => {
  let component: KhMuaHangDtqgComponent;
  let fixture: ComponentFixture<KhMuaHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhMuaHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhMuaHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
