/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DanhSachDeNghiCapVonComponent } from './danh-sach-de-nghi-cap-von.component';

describe('DanhSachDeNghiCapVonComponent', () => {
  let component: DanhSachDeNghiCapVonComponent;
  let fixture: ComponentFixture<DanhSachDeNghiCapVonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanhSachDeNghiCapVonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanhSachDeNghiCapVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
