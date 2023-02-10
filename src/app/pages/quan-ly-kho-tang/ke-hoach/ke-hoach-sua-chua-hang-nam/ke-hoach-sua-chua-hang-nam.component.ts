import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ke-hoach-sua-chua-hang-nam',
  templateUrl: './ke-hoach-sua-chua-hang-nam.component.html',
  styleUrls: ['./ke-hoach-sua-chua-hang-nam.component.scss']
})
export class KeHoachSuaChuaHangNamComponent implements OnInit {

  tabSelected: string = "dxkh";
  constructor() { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
