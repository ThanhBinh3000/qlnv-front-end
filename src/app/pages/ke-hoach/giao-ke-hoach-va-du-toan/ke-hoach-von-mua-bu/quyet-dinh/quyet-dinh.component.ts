import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
