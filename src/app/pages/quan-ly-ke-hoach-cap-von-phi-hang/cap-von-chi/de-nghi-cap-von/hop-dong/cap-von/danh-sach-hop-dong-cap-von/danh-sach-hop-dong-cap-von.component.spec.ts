/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DanhSachHopDongCapVonComponent } from './danh-sach-hop-dong-cap-von.component';

describe('DanhSachHopDongCapVonComponent', () => {
  let component: DanhSachHopDongCapVonComponent;
  let fixture: ComponentFixture<DanhSachHopDongCapVonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanhSachHopDongCapVonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachHopDongCapVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
