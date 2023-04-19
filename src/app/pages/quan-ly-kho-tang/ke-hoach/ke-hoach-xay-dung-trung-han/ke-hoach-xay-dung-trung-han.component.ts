import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-ke-hoach-xay-dung-trung-han',
  templateUrl: './ke-hoach-xay-dung-trung-han.component.html',
  styleUrls: ['./ke-hoach-xay-dung-trung-han.component.scss']
})
export class KeHoachXayDungTrungHanComponent implements OnInit {

  tabSelected: string = "dxkh";
  constructor(
    public userService : UserService
  ) { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
