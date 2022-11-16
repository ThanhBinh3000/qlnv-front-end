/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DuToanGiaoTuCapTrenComponent } from './du-toan-giao-tu-cap-tren.component';

describe('DuToanGiaoTuCapTrenComponent', () => {
  let component: DuToanGiaoTuCapTrenComponent;
  let fixture: ComponentFixture<DuToanGiaoTuCapTrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuToanGiaoTuCapTrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuToanGiaoTuCapTrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
