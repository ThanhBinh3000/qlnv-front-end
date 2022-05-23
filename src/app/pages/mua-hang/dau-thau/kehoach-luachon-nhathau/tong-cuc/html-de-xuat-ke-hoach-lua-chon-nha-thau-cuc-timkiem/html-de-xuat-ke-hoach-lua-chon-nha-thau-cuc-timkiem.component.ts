import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-timkiem',
  templateUrl: './html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-timkiem.component.html',
  styleUrls: ['./html-de-xuat-ke-hoach-lua-chon-nha-thau-cuc-timkiem.component.scss']
})
export class DexuatKhlcntCucTimkiemComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  constructor() { }

  ngOnInit(): void {
  }

}
