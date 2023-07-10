import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";

@Component({
  selector: 'app-xuat-hang-dtqg-th-bkk',
  templateUrl: './xuat-hang-dtqg-th-bkk.component.html',
  styleUrls: ['./xuat-hang-dtqg-th-bkk.component.scss']
})
export class XuatHangDtqgThBkkComponent implements OnInit {

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

}
