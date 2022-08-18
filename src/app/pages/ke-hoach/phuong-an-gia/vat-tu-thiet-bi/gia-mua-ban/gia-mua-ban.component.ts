import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gia-mua-ban',
  templateUrl: './gia-mua-ban.component.html',
  styleUrls: ['./gia-mua-ban.component.scss']
})
export class GiaMuaBanComponent implements OnInit {

  constructor() { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
