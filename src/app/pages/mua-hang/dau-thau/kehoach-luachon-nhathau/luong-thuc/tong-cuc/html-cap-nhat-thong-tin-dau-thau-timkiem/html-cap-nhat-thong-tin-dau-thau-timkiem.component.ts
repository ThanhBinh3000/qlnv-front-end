import { Component, OnInit } from '@angular/core';
import { DATEPICKER_CONFIG, LEVEL, PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
@Component({
  selector: 'app-html-cap-nhat-thong-tin-dau-thau-timkiem',
  templateUrl: './html-cap-nhat-thong-tin-dau-thau-timkiem.component.html',
  styleUrls: ['./html-cap-nhat-thong-tin-dau-thau-timkiem.component.scss']
})
export class CapnhatThongtindauthauTimkiemComponent implements OnInit {
  datePickerConfig = DATEPICKER_CONFIG;
  index = 0;
  constructor() { }

  ngOnInit(): void {
  }
  onIndexChangetTabset(event: number): void {
    this.index = event;
  }
}
