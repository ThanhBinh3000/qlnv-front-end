import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-xuat-hang',
  templateUrl: './xuat-hang.component.html',
  styleUrls: ['./xuat-hang.component.scss']
})
export class XuatHangComponent implements OnInit {
  defaultUrl: string = 'sua-chua/xuat-hang'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
    })
  }

  routes: any[] = [
    {
      url: '/giao-nv-xh',
      name: 'Quyết định giao nhiệm vụ xuất hàng',
      accessPermisson: 'SCHDTQG_XH_QDGNVXH'
    },
    {
      url: '/phieu-xuat-kho',
      name: 'Phiếu xuất kho',
      accessPermisson: 'SCHDTQG_XH_PXK'
    },
    {
      url: '/bang-ke',
      name: 'Bảng kê xuất vật tư',
      accessPermisson: 'SCHDTQG_XH_BKXVT'

    }
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
