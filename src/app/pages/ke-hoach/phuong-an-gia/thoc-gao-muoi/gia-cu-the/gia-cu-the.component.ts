import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gia-cu-the',
  templateUrl: './gia-cu-the.component.html',
  styleUrls: ['./gia-cu-the.component.scss']
})
export class GiaCuTheComponent implements OnInit {

  constructor() { }
  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}

