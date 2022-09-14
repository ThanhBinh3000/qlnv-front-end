import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ke-hoach-xay-dung-hang-nam',
  templateUrl: './ke-hoach-xay-dung-hang-nam.component.html',
  styleUrls: ['./ke-hoach-xay-dung-hang-nam.component.scss']
})
export class KeHoachXayDungHangNamComponent implements OnInit {

  tabSelected: string = "dxnc";
  constructor() { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
