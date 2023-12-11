import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Globals} from 'src/app/shared/globals';
import {Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-dinh-muc-phi',
  templateUrl: './dinh-muc-phi.component.html',
  styleUrls: ['./dinh-muc-phi.component.scss']
})
export class DinhMucPhiComponent implements OnInit {
  $routerChange: Subscription;
  capDvi: number;

  constructor(
    public globals: Globals,
    public userService: UserService,
    public router: Router,
  ) {
  }
  tabSelected = '';
  selectTab(tab) {
    this.tabSelected = tab;
    if (tab == '01') {
      this.capDvi = 1;
    } else {
      this.capDvi = 2;
    }
  }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLĐMNXBQ_ĐMPNXBP')) {
      this.router.navigateByUrl('/error/401')
    }
    this.selectTab(this.tabSelected);
  }
}
