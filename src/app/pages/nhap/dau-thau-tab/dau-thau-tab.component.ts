import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { MUOI_LIST, VAT_TU_LIST, LUONG_THUC_LIST } from 'src/app/pages/nhap/dau-thau/dau-thau.constant';

@Component({
  selector: 'dau-thau-tab',
  templateUrl: './dau-thau-tab.component.html',
  styleUrls: ['./dau-thau-tab.component.scss'],
})
export class DauThauTabComponent implements OnInit {
  muoiList = MUOI_LIST;
  vatTuList = VAT_TU_LIST;
  luongThucList = LUONG_THUC_LIST;
  tabSelected: string = "luong-thuc";
  @Input() selectedIndex: number = 0;
  routerUrl: string = "";
  selectedTabNow: number = 0;
  defaultUrl: string = '/nhap/dau-thau/'

  constructor(
    private router: Router,
  ) {
    if (this.router.url) {
      this.routerUrl = this.router.url.replace(this.defaultUrl, '');
    }
  }

  ngOnInit(): void {
    if (this.router.url.indexOf('/muoi/')) {
      this.selectedTabNow = 1;
    }
    else if (this.router.url.indexOf('/vat-tu/')) {
      this.selectedTabNow = 2;
    }
    else {
      this.selectedTabNow = 0;
    }
  }

  redirect(url: string) {
    this.router.navigate([this.defaultUrl + url]);
  }
}
