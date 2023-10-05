import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-hop-dong',
  templateUrl: './main-hop-dong.component.html',
})
export class MainHopDongComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
