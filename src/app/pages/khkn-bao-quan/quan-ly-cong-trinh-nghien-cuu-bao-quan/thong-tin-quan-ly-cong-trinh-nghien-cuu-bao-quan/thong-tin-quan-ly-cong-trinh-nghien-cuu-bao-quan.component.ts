import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan',
  templateUrl: './thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.html',
  styleUrls: ['./thong-tin-quan-ly-cong-trinh-nghien-cuu-bao-quan.component.scss']
})
export class ThongTinQuanLyCongTrinhNghienCuuBaoQuanComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  tabSelected: number = 0;
  constructor() { }

  ngOnInit() {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
  quayLai() {
    this.showListEvent.emit();
  }
}
