import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";

@Component({
  selector: 'app-tien-do-xay-dung-sua-chua',
  templateUrl: './sap-nhap-kho.component.html',
  styleUrls: ['./sap-nhap-kho.component.scss']
})
export class SapNhapKhoComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected: number = this.getDefaultTab();
  getDefaultTab() {
    let result: number = 0;
    if (this.userService.isAccessPermisson("QLKT_THSDK_QDDCSN")) {
      result = 0;
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_DDMK")) {
      result = 1;
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_DCK")) {
      result = 2;
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_PXHHH")) {
      result = 3
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_BBSN")) {
      result = 4
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_PNH")) {
      result = 5
    } else if (this.userService.isAccessPermisson("QLKT_THSDK_BCKQTH")) {
      result = 6
    } else {
      result = null
    }
    return result;
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
