import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noi-bo-chi-cuc',
  templateUrl: './noi-bo-chi-cuc.component.html',
  styleUrls: ['./noi-bo-chi-cuc.component.scss']
})
export class NoiBoChiCucComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
