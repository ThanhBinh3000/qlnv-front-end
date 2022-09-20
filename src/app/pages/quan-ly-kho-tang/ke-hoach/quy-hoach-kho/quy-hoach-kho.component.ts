import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quy-hoach-kho',
  templateUrl: './quy-hoach-kho.component.html',
  styleUrls: ['./quy-hoach-kho.component.scss']
})
export class QuyHoachKhoComponent implements OnInit {
  tabSelected: string = "qdqh";
  constructor() { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
