import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-xuat-kho-thanh-ly',
  templateUrl: './xuat-kho-thanh-ly.component.html',
  styleUrls: ['./xuat-kho-thanh-ly.component.scss']
})
export class XuatKhoThanhLyComponent implements OnInit {
  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
