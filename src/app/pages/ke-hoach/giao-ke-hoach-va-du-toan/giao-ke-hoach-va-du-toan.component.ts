import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/shared/globals';
import {UserService} from "../../../services/user.service";
@Component({
  selector: 'giao-ke-hoach-va-du-toan',
  templateUrl: './giao-ke-hoach-va-du-toan.component.html',
  styleUrls: ['./giao-ke-hoach-va-du-toan.component.scss'],
})
export class GiaoKeHoachVaDuToanComponent implements OnInit {
  // tabH = 0;
  constructor(
    public globals: Globals,
    public userService: UserService
  ) { }
  tabSelected = 'kehoachvondaunam';
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
