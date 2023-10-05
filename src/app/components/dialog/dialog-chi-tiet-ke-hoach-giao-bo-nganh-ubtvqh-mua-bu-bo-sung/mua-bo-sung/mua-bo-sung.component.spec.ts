import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuaBoSungComponent } from './mua-bo-sung.component';

describe('MuaBoSungComponent', () => {
  let component: MuaBoSungComponent;
  let fixture: ComponentFixture<MuaBoSungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuaBoSungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MuaBoSungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
