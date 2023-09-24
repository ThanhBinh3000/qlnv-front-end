import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-to-chuc-thanh-ly',
  templateUrl: './to-chuc-thanh-ly.component.html',
  styleUrls: ['./to-chuc-thanh-ly.component.scss']
})
export class ToChucThanhLyComponent implements OnInit {

  defaultUrl: string = 'xuat/xuat-thanh-ly/to-chuc'
  routerUrl: string = "";
  routes: any[] = [
    {
      url: '/thong-tin-dau-gia',
      name: 'Thông tin đấu giá thanh lý hàng DTQG',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG_TBBDG'
    },
    {
      url: '/qd-pd-kq',
      name: 'Quyết định phê duyệt kết quả bán đấu giá thanh lý hàng DTQG',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG_QDKQDG'
    },
    {
      url: '/hop-dong',
      name: 'Hợp đồng',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG_HDPL'
    },
    {
      url: '/qd-giao-nv-xh',
      name: 'Quyết định giao nhiệm vụ xuất hàng',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG_QDGNVXH'
    }
  ]
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
    })
  }

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
  }

  redirectUrl(url) {
    this.router.navigate([this.defaultUrl + url]);
  }

}
