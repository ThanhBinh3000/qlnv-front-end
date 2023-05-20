import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-khong-thay-doi-thu-kho',
  templateUrl: './khong-thay-doi-thu-kho.component.html',
  styleUrls: ['./khong-thay-doi-thu-kho.component.scss']
})
export class KhongThayDoiThuKhoComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
