import { Component, Input, OnInit } from '@angular/core';
import { UserService } from "../../../../../services/user.service";
import { Globals } from "../../../../../shared/globals";

@Component({
  selector: 'app-nhap-kho-menu',
  templateUrl: './nhap-kho-menu.component.html',
  styleUrls: ['./nhap-kho-menu.component.scss']
})
export class NhapKhoMenuComponent implements OnInit {
  @Input() typeVthh: string;
  constructor(public userService: UserService, public globals: Globals) { }

  ngOnInit(): void {
  }
  tabSelected: number = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }
}
