import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-giao-du-toan',
  templateUrl: './giao-du-toan.component.html',
  styleUrls: ['./giao-du-toan.component.scss']
})
export class GiaoDuToanComponent implements OnInit {

  tabSelected: string = "quyetDinh";
  data: any;

  constructor(

  ) { }

  async ngOnInit() {
  };


  selectTab(tab) {
    this.tabSelected = tab;
  }

  changeTab(obj: any) {
    if (obj?.preTab) {
      this.data = obj;
    } else {
      this.data = {
        ...obj,
        preTab: this.tabSelected,
      };
    }
    this.tabSelected = obj?.tabSelected;
  }

}
