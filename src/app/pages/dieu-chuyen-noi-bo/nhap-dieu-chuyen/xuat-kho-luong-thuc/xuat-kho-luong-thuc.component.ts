import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xuat-kho-luong-thuc',
  templateUrl: './xuat-kho-luong-thuc.component.html',
  styleUrls: ['./xuat-kho-luong-thuc.component.scss']
})
export class XuatKhoLuongThucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
