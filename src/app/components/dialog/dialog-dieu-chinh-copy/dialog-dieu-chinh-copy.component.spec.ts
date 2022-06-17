/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DialogDieuChinhCopyComponent } from './dialog-dieu-chinh-copy.component';

describe('DialogDieuChinhCopyComponent', () => {
  let component: DialogDieuChinhCopyComponent;
  let fixture: ComponentFixture<DialogDieuChinhCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDieuChinhCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDieuChinhCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
