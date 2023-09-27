import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Globals} from "../../../../../shared/globals";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-kiem-tra',
  templateUrl: './kiem-tra.component.html',
  styleUrls: ['./kiem-tra.component.scss']
})
export class KiemTraComponent implements OnInit {

  defaultUrl: string = 'xuat/xuat-thanh-ly/xuat-hang/'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
      const urlList = this.routerUrl.split("/");
      this.defaultUrl  = 'xuat/xuat-thanh-ly/xuat-hang/' + urlList[4];
    })
  }
  routes: any[] = [
    {
      url: '/xtl-bb-lm',
      name: 'Biên bản lấy mẫu/bàn giao mẫu',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_LT'
    },
    {
      url: '/xtl-phieu-ktra-cl',
      name: 'Phiếu kiểm nghiệm chất lượng',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_VT'
    },
    // {
    //   url: '/xtl-hs-kt',
    //   name: 'Hồ sơ kỹ thật',
    //   accessPermisson: 'XHDTQG_XTL_XTL_XK_LT'
    // },
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
