import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-phuong-an-gia',
  templateUrl: './main-phuong-an-gia.component.html',
  styleUrls: ['./main-phuong-an-gia.component.scss']
})
export class MainPhuongAnGiaComponent implements OnInit {
  @Input() loaiVthh: string;
  constructor() { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
