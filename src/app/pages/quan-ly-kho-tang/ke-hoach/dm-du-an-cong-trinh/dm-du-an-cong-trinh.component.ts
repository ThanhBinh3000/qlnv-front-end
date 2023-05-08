import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dm-du-an-cong-trinh',
  templateUrl: './dm-du-an-cong-trinh.component.html',
  styleUrls: ['./dm-du-an-cong-trinh.component.scss']
})
export class DmDuAnCongTrinhComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals,
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_DM')) {
      this.router.navigateByUrl('/error/401')
    }
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
