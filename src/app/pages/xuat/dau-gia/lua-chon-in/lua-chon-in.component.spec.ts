import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuaChonInComponent } from './lua-chon-in.component';

describe('LuaChonInComponent', () => {
  let component: LuaChonInComponent;
  let fixture: ComponentFixture<LuaChonInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuaChonInComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LuaChonInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
