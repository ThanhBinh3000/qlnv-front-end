import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mua-toi-da-ban-toi-thieu',
  templateUrl: './mua-toi-da-ban-toi-thieu.component.html',
  styleUrls: ['./mua-toi-da-ban-toi-thieu.component.scss']
})
export class MuaToiDaBanToiThieuComponent implements OnInit {

  constructor() { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
