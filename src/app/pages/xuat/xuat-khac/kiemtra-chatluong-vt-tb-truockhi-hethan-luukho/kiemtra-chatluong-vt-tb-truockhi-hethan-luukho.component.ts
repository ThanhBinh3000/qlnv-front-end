import {Component, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";

@Component({
  selector: 'app-kiemtra-chatluong-vt-tb-truockhi-hethan-luukho',
  templateUrl: './kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.component.html',
  styleUrls: ['./kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.component.scss']
})
export class KiemtraChatluongVtTbTruockhiHethanLuukhoComponent implements OnInit {
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
