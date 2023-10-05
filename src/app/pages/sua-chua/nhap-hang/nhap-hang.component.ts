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
      url: '/giao-nv-nh',
      name: 'Quyết định giao nhiệm vụ nhập hàng',
      accessPermisson: 'SCHDTQG_NH_QDGNVNH'
    },
    {
      url: '/phieu-nhap-kho',
      name: 'Phiếu nhập kho',
      accessPermisson: 'SCHDTQG_NH_PNK'
    },
    {
      url: '/bang-ke-nhap',
      name: 'Bảng kê nhập vật tư',
      accessPermisson: 'SCHDTQG_NH_BKNVT'
    },
    {
      url: '/bb-kt-nhap',
      name: 'Biên bản giao nhận/kết thúc nhập kho',
      accessPermisson: 'SCHDTQG_NH_BBGN'
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
