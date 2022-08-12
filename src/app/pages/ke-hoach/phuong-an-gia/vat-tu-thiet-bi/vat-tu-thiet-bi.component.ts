import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vat-tu-thiet-bi',
  templateUrl: './vat-tu-thiet-bi.component.html',
  styleUrls: ['./vat-tu-thiet-bi.component.scss']
})
export class VatTuThietBiComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;
  ngOnInit(): void {
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
