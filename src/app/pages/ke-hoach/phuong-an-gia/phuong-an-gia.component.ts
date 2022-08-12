import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-phuong-an-gia',
  templateUrl: './phuong-an-gia.component.html',
  styleUrls: ['./phuong-an-gia.component.scss']
})
export class PhuongAnGiaComponent implements OnInit {

  constructor(
    public globals: Globals
  ) { }
  tabSelected: number = 0;
  ngOnInit() {
    // this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
    // window.addEventListener('resize', (e) => {
    //   this.tabH = window.innerHeight - document.querySelector('.tab-level-0').getBoundingClientRect().top - 28;
    // });
  }
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
