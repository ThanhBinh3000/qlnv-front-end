import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-main-ke-hoach-ban-dau-gia',
  templateUrl: './main-ke-hoach-ban-dau-gia.component.html',
  styleUrls: ['./main-ke-hoach-ban-dau-gia.component.scss']
})
export class MainKeHoachBanDauGiaComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() loaiVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  tabSelected: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }
}
