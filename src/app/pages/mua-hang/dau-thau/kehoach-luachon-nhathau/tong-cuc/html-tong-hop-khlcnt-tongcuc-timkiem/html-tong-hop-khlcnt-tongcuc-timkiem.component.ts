import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-tong-hop-khlcnt-tongcuc-timkiem',
  templateUrl: './html-tong-hop-khlcnt-tongcuc-timkiem.component.html',
  styleUrls: ['./html-tong-hop-khlcnt-tongcuc-timkiem.component.scss']
})
export class TongHopKhlcntTimkiemComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  index = 0;
  constructor() { }

  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
