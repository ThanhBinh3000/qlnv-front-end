import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ke-hoach-von-mua-bu',
  templateUrl: './ke-hoach-von-mua-bu.component.html',
  styleUrls: ['./ke-hoach-von-mua-bu.component.scss']
})
export class KeHoachVonMuaBuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
