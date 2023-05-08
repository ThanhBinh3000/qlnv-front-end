import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";
import { Router } from "@angular/router";

@Component({
  selector: 'app-ke-hoach',
  templateUrl: './ke-hoach.component.html',
  styleUrls: ['./ke-hoach.component.scss']
})
export class KeHoachComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals,
    private router : Router
  ) { }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected = 'dmk';
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
