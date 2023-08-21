import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";


@Component({
  selector: 'app-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class NhapKhoVtTbTrongThoiGianBaoHanhComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
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
