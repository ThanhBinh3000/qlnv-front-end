import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";

@Component({
  selector: 'app-xuat-hang-khoi-danh-muc',
  templateUrl: './xuat-hang-khoi-danh-muc.component.html',
  styleUrls: ['./xuat-hang-khoi-danh-muc.component.scss']
})
export class XuatHangKhoiDanhMucComponent implements OnInit {

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

  tabSelected: number = this.userService.isTongCuc() ? 0 : 2;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  //
  // receivedTab(tab) {
  //   if (tab >= 0) {
  //     this.tabSelected = tab;
  //   }
  // }

}
