import { Component, Input, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
@Component({
  selector: 'app-main-cuc',
  templateUrl: './main-cuc.component.html',
  styleUrls: ['./main-cuc.component.scss']
})
export class MainCucComponent implements OnInit {

  @Input() loaiVthh: string;
  constructor(
    public globals:Globals
  ) { }

  ngOnInit(): void {
  }

  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
