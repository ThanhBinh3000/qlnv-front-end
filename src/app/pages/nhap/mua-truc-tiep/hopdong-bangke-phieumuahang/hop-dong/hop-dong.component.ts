import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hop-dong',
  templateUrl: './hop-dong.component.html',
  styleUrls: ['./hop-dong.component.scss']
})
export class HopDongComponent implements OnInit {
  @Input() typeVthh: string;

  constructor() { }

  ngOnInit() {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}