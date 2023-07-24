/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent } from './tong-hop-de-nghi-tu-don-vi-cap-duoi-theo-hop-dong.component';

describe('TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent', () => {
  let component: TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent;
  let fixture: ComponentFixture<TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDeNghiTuDonViCapDuoiTheoHopDongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
