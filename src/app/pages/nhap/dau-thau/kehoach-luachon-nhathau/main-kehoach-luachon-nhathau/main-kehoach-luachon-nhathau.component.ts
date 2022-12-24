import { Component, Input, OnInit } from '@angular/core';
import { UserService } from "../../../../../services/user.service";

@Component({
  selector: 'app-main-kehoach-luachon-nhathau',
  templateUrl: './main-kehoach-luachon-nhathau.component.html',
})
export class MainKehoachLuachonNhathauComponent implements OnInit {

  @Input() inputLoaiVthh: string;

  constructor(
    public userService: UserService
  ) { }

  ngOnInit() {
  }
  tabSelected: number = 0;
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
