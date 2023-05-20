import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xuat-kho-vat-tu',
  templateUrl: './xuat-kho-vat-tu.component.html',
  styleUrls: ['./xuat-kho-vat-tu.component.scss']
})
export class XuatKhoVatTuComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
