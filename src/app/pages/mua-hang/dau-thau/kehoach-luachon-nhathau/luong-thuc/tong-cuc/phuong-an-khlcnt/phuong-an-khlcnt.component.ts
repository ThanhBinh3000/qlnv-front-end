import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-phuong-an-khlcnt',
  templateUrl: './phuong-an-khlcnt.component.html',
  styleUrls: ['./phuong-an-khlcnt.component.scss']
})
export class PhuongAnKhlcntComponent implements OnInit {
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
