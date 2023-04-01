import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../../services/user.service";
import {Globals} from "../../../../../shared/globals";

@Component({
  selector: 'app-to-chuc-trien-khai-lua-chon-nha-thau',
  templateUrl: './to-chuc-trien-khai-lua-chon-nha-thau.component.html',
  styleUrls: ['./to-chuc-trien-khai-lua-chon-nha-thau.component.scss']
})
export class ToChucTrienKhaiLuaChonNhaThauComponent implements OnInit {

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
  tabSelected = '00';
  selectTab(tab) {
    this.tabSelected = tab;
  }


}
