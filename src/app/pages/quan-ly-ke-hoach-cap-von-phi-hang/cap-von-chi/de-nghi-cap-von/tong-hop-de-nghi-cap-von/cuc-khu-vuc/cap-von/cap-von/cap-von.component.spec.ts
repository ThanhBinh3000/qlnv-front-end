/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CapVonComponent } from './cap-von.component';

describe('CapVonComponent', () => {
  let component: CapVonComponent;
  let fixture: ComponentFixture<CapVonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapVonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
