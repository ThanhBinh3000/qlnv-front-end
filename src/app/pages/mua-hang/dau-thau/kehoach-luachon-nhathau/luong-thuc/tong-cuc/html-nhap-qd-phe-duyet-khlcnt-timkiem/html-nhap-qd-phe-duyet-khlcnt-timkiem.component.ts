import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-html-nhap-qd-phe-duyet-khlcnt-timkiem',
  templateUrl: './html-nhap-qd-phe-duyet-khlcnt-timkiem.component.html',
  styleUrls: ['./html-nhap-qd-phe-duyet-khlcnt-timkiem.component.scss']
})
export class NhapQdPheduyetKhlcntTimkiemComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  index = 0;
  constructor() { }

  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
