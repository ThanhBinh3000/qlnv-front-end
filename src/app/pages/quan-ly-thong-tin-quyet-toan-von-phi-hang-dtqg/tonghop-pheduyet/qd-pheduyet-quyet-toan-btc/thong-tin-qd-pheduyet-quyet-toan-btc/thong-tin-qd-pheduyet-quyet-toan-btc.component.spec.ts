import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQdPheduyetQuyetToanBtcComponent } from './thong-tin-qd-pheduyet-quyet-toan-btc.component';

describe('ThongTinQdPheduyetQuyetToanBtcComponent', () => {
  let component: ThongTinQdPheduyetQuyetToanBtcComponent;
  let fixture: ComponentFixture<ThongTinQdPheduyetQuyetToanBtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQdPheduyetQuyetToanBtcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQdPheduyetQuyetToanBtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
