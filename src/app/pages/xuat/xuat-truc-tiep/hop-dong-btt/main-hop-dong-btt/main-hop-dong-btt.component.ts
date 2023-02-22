import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-hop-dong-btt',
  templateUrl: './main-hop-dong-btt.component.html',
})
export class MainHopDongBttComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor() { }

  ngOnInit(): void {

  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
