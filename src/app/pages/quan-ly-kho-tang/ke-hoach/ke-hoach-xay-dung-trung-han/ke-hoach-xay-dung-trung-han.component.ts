import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-ke-hoach-xay-dung-trung-han',
  templateUrl: './ke-hoach-xay-dung-trung-han.component.html',
  styleUrls: ['./ke-hoach-xay-dung-trung-han.component.scss']
})
export class KeHoachXayDungTrungHanComponent implements OnInit {

  tabSelected: string = "dxkh";
  dataOutput : any
  constructor(
    public userService : UserService,
    public router : Router
  ) { }
  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDTRUNGHAN')) {
      this.router.navigateByUrl('/error/401')
    }
  }

  selectTab(tab, data? : any) {
    this.tabSelected = tab;
    if(data) {
      this.dataOutput = data
    }
  }
}
