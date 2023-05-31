import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-giua-hai-cuc',
  templateUrl: './giua-hai-cuc.component.html',
  styleUrls: ['./giua-hai-cuc.component.scss']
})
export class GiuaHaiCucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
