import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../services/user.service";

@Component({
  selector: 'app-ke-hoach-sua-chua-hang-nam',
  templateUrl: './ke-hoach-sua-chua-hang-nam.component.html',
  styleUrls: ['./ke-hoach-sua-chua-hang-nam.component.scss']
})
export class KeHoachSuaChuaHangNamComponent implements OnInit {

  tabSelected: string = "dxkh";
  constructor(
    public userService :UserService
  ) { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
