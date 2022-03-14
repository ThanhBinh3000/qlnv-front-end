/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent } from './tong-hop-bao-cao-ket-qua-thuc-hien-von-phi-hang-DTQG.component';

describe('TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent', () => {
  let component: TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent;
  let fixture: ComponentFixture<TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopBaoCaoKetQuaThucHienVonPhiHangDTQGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
