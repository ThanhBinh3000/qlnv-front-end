import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-giua-hai-chi-cuc',
  templateUrl: './giua-hai-chi-cuc.component.html',
  styleUrls: ['./giua-hai-chi-cuc.component.scss']
})
export class GiuaHaiChiCucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }


}
