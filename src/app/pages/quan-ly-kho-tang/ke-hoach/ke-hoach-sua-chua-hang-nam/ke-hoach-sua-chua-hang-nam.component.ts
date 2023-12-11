import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../services/user.service";
import { Route, Router } from "@angular/router";

@Component({
  selector: 'app-ke-hoach-sua-chua-hang-nam',
  templateUrl: './ke-hoach-sua-chua-hang-nam.component.html',
  styleUrls: ['./ke-hoach-sua-chua-hang-nam.component.scss']
})
export class KeHoachSuaChuaHangNamComponent implements OnInit {

  tabSelected: string = "dxkh";
  dataObject: any={};
  constructor(
    public userService :UserService,
    private router  :Router
  ) { }
  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUALON')) {
      this.router.navigateByUrl('/error/401')
    }
  }

  selectTab(tab) {
    this.tabSelected = tab;
  }
  selectData(data){
    this.tabSelected = data.tab;
    this.dataObject=data
  }
  removeData(){
    this.dataObject={}
  }
}
