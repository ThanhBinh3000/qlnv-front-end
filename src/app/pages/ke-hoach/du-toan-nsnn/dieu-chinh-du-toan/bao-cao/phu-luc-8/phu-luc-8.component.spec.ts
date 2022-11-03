/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PhuLuc-8Component } from './phu-luc-8.component';

describe('PhuLuc-8Component', () => {
  let component: PhuLuc-8Component;
  let fixture: ComponentFixture<PhuLuc-8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuLuc-8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLuc-8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
