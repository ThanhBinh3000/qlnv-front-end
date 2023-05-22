import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thay-doi-thu-kho',
  templateUrl: './thay-doi-thu-kho.component.html',
  styleUrls: ['./thay-doi-thu-kho.component.scss']
})
export class ThayDoiThuKhoComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
