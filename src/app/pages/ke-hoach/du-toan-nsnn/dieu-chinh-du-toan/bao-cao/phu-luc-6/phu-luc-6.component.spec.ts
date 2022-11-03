/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PhuLuc-6Component } from './phu-luc-6.component';

describe('PhuLuc-6Component', () => {
  let component: PhuLuc-6Component;
  let fixture: ComponentFixture<PhuLuc-6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuLuc-6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLuc-6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
