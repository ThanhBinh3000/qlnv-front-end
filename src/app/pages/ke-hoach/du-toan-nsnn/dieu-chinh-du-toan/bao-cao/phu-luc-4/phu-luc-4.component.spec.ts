/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PhuLuc-4Component } from './phu-luc-4.component';

describe('PhuLuc-4Component', () => {
  let component: PhuLuc-4Component;
  let fixture: ComponentFixture<PhuLuc-4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhuLuc-4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhuLuc-4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
