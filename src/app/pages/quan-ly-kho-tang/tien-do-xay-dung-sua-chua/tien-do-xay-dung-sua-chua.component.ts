import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tien-do-xay-dung-sua-chua',
  templateUrl: './tien-do-xay-dung-sua-chua.component.html',
  styleUrls: ['./tien-do-xay-dung-sua-chua.component.scss']
})
export class TienDoXayDungSuaChuaComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public router: Router,
    public globals: Globals
  ) { }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_TDXDSCKT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected = 'dautu-xaydung';
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
