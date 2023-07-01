/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogTaoMoiDeNghiCapVonComponent } from './dialog-tao-moi-de-nghi-cap-von.component';

describe('DialogTaoMoiDeNghiCapVonComponent', () => {
  let component: DialogTaoMoiDeNghiCapVonComponent;
  let fixture: ComponentFixture<DialogTaoMoiDeNghiCapVonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTaoMoiDeNghiCapVonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTaoMoiDeNghiCapVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
