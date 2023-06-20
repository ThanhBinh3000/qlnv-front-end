import { Component, Input, OnInit } from '@angular/core';
import { TYPE_PAG } from 'src/app/constants/config';
import {UserService} from "../../../../services/user.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-main-phuong-an-gia',
  templateUrl: './main-phuong-an-gia.component.html',
  styleUrls: ['./main-phuong-an-gia.component.scss']
})
export class MainPhuongAnGiaComponent implements OnInit {
  @Input() loaiVthh: string;

  type: any;
  constructor(
    public userService : UserService,
    public router : Router
  ) {
    this.type = TYPE_PAG;
  }
  tabSelected: number;
  ngOnInit(): void {
    if ((this.loaiVthh == 'LT' && (!this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_LT'))) || (this.loaiVthh == 'VT' && (!this.userService.isAccessPermisson('KHVDTNSNN_PAGIA_VT'))))  {
      this.router.navigateByUrl('/error/401')
    }
  }
  selectTab(tab: number) {
    this.tabSelected = tab;

  }
}
