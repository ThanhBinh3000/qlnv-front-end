/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PhuLuc-5Component } from './phu-luc-5.component';

describe('PhuLuc-5Component', () => {
  let component: PhuLuc-5Component;
  let fixture: ComponentFixture<PhuLuc-5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuLuc-5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLuc-5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
