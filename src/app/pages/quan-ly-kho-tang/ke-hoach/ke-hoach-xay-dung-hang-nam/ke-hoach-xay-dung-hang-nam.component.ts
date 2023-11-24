import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-ke-hoach-xay-dung-hang-nam',
  templateUrl: './ke-hoach-xay-dung-hang-nam.component.html',
  styleUrls: ['./ke-hoach-xay-dung-hang-nam.component.scss']
})
export class KeHoachXayDungHangNamComponent implements OnInit {

  tabSelected: string = "dxnc";
  dataObject: any={};
  constructor(
    public  userService : UserService,
    private router : Router
  ) { }
  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHDTXDHANGNAM')) {
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
