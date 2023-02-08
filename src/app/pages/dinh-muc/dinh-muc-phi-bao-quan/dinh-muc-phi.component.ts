import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Globals} from 'src/app/shared/globals';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dinh-muc-phi',
  templateUrl: './dinh-muc-phi.component.html',
  styleUrls: ['./dinh-muc-phi.component.scss']
})
export class DinhMucPhiComponent implements OnInit {
  $routerChange: Subscription;

  constructor(
    public globals: Globals
  ) {
  }
  tabSelected = '01';
  selectTab(tab) {
    this.tabSelected = tab;
  }

  ngOnInit(): void {
  }
}
