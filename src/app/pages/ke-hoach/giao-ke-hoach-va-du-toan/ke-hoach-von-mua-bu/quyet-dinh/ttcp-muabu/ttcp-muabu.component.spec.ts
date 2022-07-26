import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtcpMuabuComponent } from './ttcp-muabu.component';

describe('TtcpMuabuComponent', () => {
  let component: TtcpMuabuComponent;
  let fixture: ComponentFixture<TtcpMuabuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TtcpMuabuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TtcpMuabuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
