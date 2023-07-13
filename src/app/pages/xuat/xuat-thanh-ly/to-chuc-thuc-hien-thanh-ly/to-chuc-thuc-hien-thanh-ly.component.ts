import {Component, OnInit} from '@angular/core';
import {UserService} from "src/app/services/user.service";

@Component({
  selector: 'app-to-chuc-thuc-hien-thanh-ly',
  templateUrl: './to-chuc-thuc-hien-thanh-ly.component.html',
  styleUrls: ['./to-chuc-thuc-hien-thanh-ly.component.scss']
})
export class ToChucThucHienThanhLyComponent implements OnInit {
  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
