import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbtvqhMuabuComponent } from './ubtvqh-muabu.component';

describe('UbtvqhMuabuComponent', () => {
  let component: UbtvqhMuabuComponent;
  let fixture: ComponentFixture<UbtvqhMuabuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbtvqhMuabuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbtvqhMuabuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
