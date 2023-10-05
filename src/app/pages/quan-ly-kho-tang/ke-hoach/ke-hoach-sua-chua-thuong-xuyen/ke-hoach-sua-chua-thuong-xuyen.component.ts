import { Component, OnInit } from '@angular/core';
import {Globals} from "../../../../shared/globals";
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-ke-hoach-sua-chua-thuong-xuyen',
  templateUrl: './ke-hoach-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./ke-hoach-sua-chua-thuong-xuyen.component.scss']
})
export class KeHoachSuaChuaThuongXuyenComponent implements OnInit {

  tabSelected: string = "01";

  constructor(
    public globals: Globals,
    public userService: UserService
  ) { }

  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
