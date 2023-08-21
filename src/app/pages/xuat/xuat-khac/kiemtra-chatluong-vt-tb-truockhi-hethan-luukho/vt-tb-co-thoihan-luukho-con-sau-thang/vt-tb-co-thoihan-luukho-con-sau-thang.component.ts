import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";

@Component({
  selector: 'app-vt-tb-co-thoihan-luukho-con-sau-thang',
  templateUrl: './vt-tb-co-thoihan-luukho-con-sau-thang.component.html',
  styleUrls: ['./vt-tb-co-thoihan-luukho-con-sau-thang.component.scss']
})
export class VtTbCoThoihanLuukhoConSauThangComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  dataInit: any = {};
  isDetail: boolean;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  receivedTab(tab) {
    if (tab >= 0) {
      this.tabSelected = tab;
    }
  }
}
