import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Globals} from "../../../shared/globals";

@Component({
  selector: 'app-hang-trong-kho',
  templateUrl: './hang-trong-kho.component.html',
  styleUrls: ['./hang-trong-kho.component.scss']
})
export class HangTrongKhoComponent implements OnInit {

  defaultUrl: string = 'luu-kho/hang-trong-kho'

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
      url : '/tat-ca',
      name : 'Tất cả'
    },
    {
      url : '/thanh-ly',
      name : 'Thuộc diện thanh lý'
    },
    {
      url : '/tieu-huy',
      name : 'Thuộc diện tiêu hủy'
    },
    {
      url : '/sap-het-han-bao-hanh',
      name : 'Sắp hết hạn bảo hành'
    },
    {
      url : '/het-han-luu-kho',
      name : 'Sắp hết hạn lưu kho nhưng chưa có KH xuất kho'
    },
    {
      url : '/hong-hoc-giam-cl',
      name : 'Hỏng hóc, giảm chất lượng do nguyên nhân bất khả kháng'
    },
    {
      url : '/hong-hoc-bao-hanh',
      name : 'Bị hỏng cần bảo hành'
    },
    {
      url : '/hong-hoc-sua-chua',
      name : 'Bị hỏng cần sửa chữa'
    },
    {
      url : '/da-het-han',
      name : 'Đã hết hạn bảo hành, chưa hết hạn lưu kho'
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
