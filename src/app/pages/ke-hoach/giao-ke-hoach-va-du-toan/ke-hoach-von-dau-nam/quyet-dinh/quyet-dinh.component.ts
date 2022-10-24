import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent implements OnInit {
  tabSelected: number = 0;
  constructor() { }

  ngOnInit() {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
