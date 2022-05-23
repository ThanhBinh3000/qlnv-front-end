import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-html-nhap-qd-phe-duyet-kqlcnt-themmoi',
  templateUrl: './html-nhap-qd-phe-duyet-kqlcnt-themmoi.component.html',
  styleUrls: ['./html-nhap-qd-phe-duyet-kqlcnt-themmoi.component.scss']
})
export class NhapQdPheduyetKqlcntThemmoiComponent implements OnInit {
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
