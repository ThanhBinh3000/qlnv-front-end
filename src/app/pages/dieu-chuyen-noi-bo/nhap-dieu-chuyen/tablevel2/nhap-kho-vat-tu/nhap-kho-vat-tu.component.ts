import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nhap-kho-vat-tu',
  templateUrl: './nhap-kho-vat-tu.component.html',
  styleUrls: ['./nhap-kho-vat-tu.component.scss']
})
export class NhapKhoVatTuComponent implements OnInit {

  constructor() { }

  tabSelected: number = 0;

  ngOnInit(): void {
  }

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
