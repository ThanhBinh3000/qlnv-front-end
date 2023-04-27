import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-ke-hoach-xay-dung-hang-nam',
  templateUrl: './ke-hoach-xay-dung-hang-nam.component.html',
  styleUrls: ['./ke-hoach-xay-dung-hang-nam.component.scss']
})
export class KeHoachXayDungHangNamComponent implements OnInit {

  tabSelected: string = "dxnc";
  constructor(
    public  userService : UserService
  ) { }
  ngOnInit(): void {
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }

}
