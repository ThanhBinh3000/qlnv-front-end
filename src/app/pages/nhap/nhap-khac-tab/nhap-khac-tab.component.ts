import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nhap-khac-tab',
  templateUrl: './nhap-khac-tab.component.html',
  styleUrls: ['./nhap-khac-tab.component.scss'],
})
export class MNhapKhacTabComponent implements OnInit {
  @Input() children: any[] = [];
  gaoList: any[] = [];
  thocList: any[] = [];
  tabSelected: string = "luong-thuc";
  @Input() selectedIndex: number = 0;
  routerUrl: string = "";
  selectedTabNow: number = 0;
  defaultUrl: string = '/mua-hang/mua-truc-tiep/'

  constructor(
    private router: Router,
  ) {
    if (this.router.url) {
      this.routerUrl = this.router.url.replace(this.defaultUrl, '');
    }
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('/muoi/') != -1) {
      this.selectedTabNow = 1;
    }
    else if (this.router.url.indexOf('/vat-tu/') != -1) {
      this.selectedTabNow = 2;
    }
    else {
      this.selectedTabNow = 0;
    }
    this.thocList = this.children[0].data;
    this.gaoList = this.children[1].data;
  }

  redirect(url: string) {
    this.router.navigate([this.defaultUrl + url]);
  }
}
