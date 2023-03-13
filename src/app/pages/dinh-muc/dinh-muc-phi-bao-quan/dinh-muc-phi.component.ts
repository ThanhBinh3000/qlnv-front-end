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
  ) {
  }
  tabSelected = '01';
  selectTab(tab) {
    this.tabSelected = tab;
    if (tab == '01') {
      this.capDvi = 1;
    } else {
      this.capDvi = 2;
    }
  }

  ngOnInit(): void {
    this.selectTab(this.tabSelected);
  }
}
