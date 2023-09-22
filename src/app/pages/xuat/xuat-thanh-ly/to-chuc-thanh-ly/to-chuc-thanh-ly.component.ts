import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-nhap-hang',
  templateUrl: './nhap-hang.component.html',
  styleUrls: ['./nhap-hang.component.scss']
})
export class NhapHangComponent implements OnInit {

  defaultUrl: string = 'sua-chua/nhap-hang'
  routerUrl: string = "";

  routes: any[] = [
    {
      url: '/thong-tin-dau-gia',
      name: 'Thông tin đấu giá thanh lý hàng DTQG',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG_TBBDG'
    },
    {
      url: '/quyet-dinh-pd-kq',
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
