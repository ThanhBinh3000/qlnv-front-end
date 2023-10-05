import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-hop-dong',
  templateUrl: './main-hop-dong.component.html',
})
export class MainHopDongComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor() { }

  ngOnInit(): void {

  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
