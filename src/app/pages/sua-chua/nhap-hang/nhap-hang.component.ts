import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
      url : '/giao-nv-nh',
      name : 'Quyết định giao nhiệm vụ nhập hàng'
    },
    {
      url : '/phieu-nhap-kho',
      name : 'Phiếu nhập kho'
    },
    {
      url : '/bang-ke-nhap',
      name : 'Bảng kê nhập vật tư'
    },
    {
      url : '/bb-thuc-nhap',
      name : 'Bảng bản giao nhận/kết thúc nhập kho'
    }
  ]
  constructor(
    private router: Router,
    public globals: Globals,
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
