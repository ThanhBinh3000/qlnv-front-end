import {Component, OnInit} from '@angular/core';
import {UserService} from "src/app/services/user.service";

@Component({
  selector: 'app-thuc-hien-xuat-thanh-ly',
  templateUrl: './thuc-hien-xuat-thanh-ly.component.html',
  styleUrls: ['./thuc-hien-xuat-thanh-ly.component.scss']
})
export class ThucHienXuatThanhLyComponent implements OnInit {
  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
