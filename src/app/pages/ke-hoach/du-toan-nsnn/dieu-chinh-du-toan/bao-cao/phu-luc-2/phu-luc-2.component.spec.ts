/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PhuLuc-2Component } from './phu-luc-2.component';

describe('PhuLuc-2Component', () => {
  let component: PhuLuc-2Component;
  let fixture: ComponentFixture<PhuLuc-2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuLuc-2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLuc-2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
