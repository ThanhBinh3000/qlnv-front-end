import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-phuong-an-khlcnht-cua-tong-cuc-timkiem',
  templateUrl: './phuong-an-khlcnht-cua-tong-cuc-timkiem.component.html',
  styleUrls: ['./phuong-an-khlcnht-cua-tong-cuc-timkiem.component.scss']
})
export class PhuonganKhlcnhtTcTimkiemComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  constructor() { }

  ngOnInit(): void {
  }

}
