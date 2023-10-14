import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../services/user.service";
import {Globals} from "../../../shared/globals";
import {STATUS} from "../../../constants/status";
import {cloneDeep} from 'lodash';
import {Router} from "@angular/router";

@Component({
  selector: 'app-xuat-tieu-huy',
  templateUrl: './xuat-tieu-huy.component.html',
  styleUrls: ['./xuat-tieu-huy.component.scss']
})
export class XuatTieuHuyComponent implements OnInit {
  defaultUrl: string = 'xuat/xuat-tieu-huy'

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
      url: '/danh-sach',
      name: 'Toàn bộ danh sách hàng DTQG cần tiêu hủy',
      accessPermisson: 'XHDTQG_XTH_DSCTH'
    },
    {
      url: '/tong-hop',
      name: 'Tổng hợp danh sách hàng DTQG cần tiêu hủy',
      accessPermisson: 'XHDTQG_XTH_THDSCTH'
    },
    {
      url: '/trinh-tham-dinh',
      name: 'Trình và thẩm định hồ sơ tiêu hủy',
      accessPermisson: 'XHDTQG_XTH_HSTH'
    },
    {
      url: '/quyet-dinh',
      name: 'Quyết định tiêu hủy',
      accessPermisson: 'XHDTQG_XTH_QDTH'
    },
    {
      url: '/thong-bao-kq',
      name: 'Thông báo kết quả trình hồ sơ',
      accessPermisson: 'XHDTQG_XTH_TBKQ'
    },
    {
      url: '/bao-cao-kq',
      name: 'Báo cáo kết quả tiêu hủy',
      accessPermisson: 'XHDTQG_XTH_BCKQ'
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
