import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-theo-phuong-thuc-dau-thau',
  templateUrl: './theo-phuong-thuc-dau-thau.component.html',
  styleUrls: ['./theo-phuong-thuc-dau-thau.component.scss']
})
export class TheoPhuongThucDauThauComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
