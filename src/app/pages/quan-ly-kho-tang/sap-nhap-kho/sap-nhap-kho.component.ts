import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";

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
  tabSelected: number = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
