/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeNghiCapVonComponent } from './de-nghi-cap-von.component';

describe('DeNghiCapVonComponent', () => {
  let component: DeNghiCapVonComponent;
  let fixture: ComponentFixture<DeNghiCapVonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeNghiCapVonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeNghiCapVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
