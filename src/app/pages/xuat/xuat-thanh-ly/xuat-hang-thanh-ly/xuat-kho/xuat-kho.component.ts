import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Globals} from "../../../../../shared/globals";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-xuat-kho',
  templateUrl: './xuat-kho.component.html',
  styleUrls: ['./xuat-kho.component.scss']
})
export class XuatKhoComponent implements OnInit {

  defaultUrl: string = 'xuat/xuat-thanh-ly/xuat-hang'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
      const urlList = this.routerUrl.split("/");
      this.defaultUrl  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[urlList.length-2];
    })
  }

  routes: any[] = [
    {
      url: '/xtl-phieu-xk',
      name: 'Phiếu xuất kho',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_LT'
    },
    {
      url: '/xtl-bang-ke-ch',
      name: 'Bảng kê cân hàng',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_VT'
    },
    {
      url: '/xtl-bb-tinh-kho',
      name: 'Biên bản tịnh khó',
      accessPermisson: 'XHDTQG_XTL_XTL_XK_LT'
    },
    {
      url: '/xtl-bb-hao-doi',
      name: 'Biên bản hao dôi',
      accessPermisson: 'XHDTQG_XTL_XTL_XK_LT'
    },
  ]

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
  }

  redirectUrl(url) {
    this.router.navigate([this.defaultUrl + url]);
  }

}
