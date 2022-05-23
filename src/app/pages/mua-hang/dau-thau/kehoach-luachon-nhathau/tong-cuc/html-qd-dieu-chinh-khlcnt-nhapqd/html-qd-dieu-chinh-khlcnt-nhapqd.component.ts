import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-html-qd-dieu-chinh-khlcnt-nhapqd',
  templateUrl: './html-qd-dieu-chinh-khlcnt-nhapqd.component.html',
  styleUrls: ['./html-qd-dieu-chinh-khlcnt-nhapqd.component.scss']
})
export class QdDieuchinhKhlcntNhapqdComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  index = 0;
  radioValue='';
  constructor() { }

  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
