import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-xuat-hang-thanh-ly',
  templateUrl: './xuat-hang-thanh-ly.component.html',
  styleUrls: ['./xuat-hang-thanh-ly.component.scss']
})
export class XuatHangThanhLyComponent implements OnInit {
  defaultUrl: string = 'xuat/xuat-thanh-ly/xuat-hang'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
    })
  }
  routes: any[] = [
    {
      url: '/kiem-tra-lt',
      name: 'Kiểm tra chất lượng lương thực',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_LT'
    },
    {
      url: '/kiem-tra-vt',
      name: 'Kiểm tra chất lượng vật tư',
      accessPermisson: 'XHDTQG_XTL_XTL_KTCL_VT'
    },
    {
      url: '/xuat-kho-lt',
      name: 'Xuất kho lương thực',
      accessPermisson: 'XHDTQG_XTL_XTL_XK_LT'
    },
    {
      url: '/xuat-kho-vt',
      name: 'Xuất kho vật tư',
      accessPermisson: 'XHDTQG_XTL_XTL_XK_VT'
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
