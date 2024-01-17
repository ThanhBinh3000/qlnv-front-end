import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";
import { STATUS } from "../../../constants/status";
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-xuat-thanh-ly',
  templateUrl: './xuat-thanh-ly.component.html',
  styleUrls: ['./xuat-thanh-ly.component.scss']
})
export class XuatThanhLyComponent implements OnInit {

  defaultUrl: string = 'xuat/xuat-thanh-ly'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      if(this.routerUrl != this.router.url){
        this.routerUrl = this.router.url;
        console.log('1',this.routerUrl);
        console.log('2',this.router.url);
      }
    })
  }

  routes: any[] = [
    {
      url: '/danh-sach',
      name: 'Toàn bộ danh sách hàng DTQG cần thanh lý',
      accessPermisson: 'XHDTQG_XTL_DSCTL'
    },
    {
      url: '/tong-hop',
      name: 'Tổng hợp danh sách hàng DTQG cần thanh lý',
      accessPermisson: 'XHDTQG_XTL_THDSCTL'
    },
    {
      url: '/trinh-tham-dinh',
      name: 'Trình và thẩm định hồ sơ thanh lý',
      accessPermisson: 'XHDTQG_XTL_HSTL'
    },
    {
      url: '/quyet-dinh',
      name: 'Quyết định thanh lý',
      accessPermisson: 'XHDTQG_XTL_QDTL'
    },
    {
      url: '/thong-bao-kq',
      name: 'Thông báo kết quả trình hồ sơ',
      accessPermisson: 'XHDTQG_XTL_TBKQ'
    },
    {
      url: '/to-chuc',
      name: 'Tổ chức thực hiện thanh lý hàng DTQG',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG'
    },
    {
      url: '/xuat-hang',
      name: 'Xuất thanh lý',
      accessPermisson: 'XHDTQG_XTL_XTL'
    },
    {
      url: '/bao-cao-kq',
      name: 'Báo cáo kết quả thanh lý',
      accessPermisson: 'XHDTQG_XTL_BCKQ'
    }
  ]

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
  }

  redirectUrl(url) {
    console.log(this.defaultUrl + url);
    this.router.navigate([this.defaultUrl + url]);
  }
}
