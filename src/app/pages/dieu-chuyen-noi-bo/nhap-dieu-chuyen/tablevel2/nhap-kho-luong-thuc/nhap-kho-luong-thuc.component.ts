import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nhap-kho-luong-thuc',
  templateUrl: './nhap-kho-luong-thuc.component.html',
  styleUrls: ['./nhap-kho-luong-thuc.component.scss']
})
export class NhapKhoLuongThucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
