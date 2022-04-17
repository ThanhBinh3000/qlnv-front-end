import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MUOI_LIST, VAT_TU_LIST, GAO_LIST, THOC_LIST } from 'src/app/pages/mua-hang/mua-truc-tiep/mua-truc-tiep.constant';

@Component({
  selector: 'mua-truc-tiep-tab',
  templateUrl: './mua-truc-tiep-tab.component.html',
  styleUrls: ['./mua-truc-tiep-tab.component.scss'],
})
export class MuaTrucTiepTabComponent implements OnInit {
  muoiList = MUOI_LIST;
  vatTuList = VAT_TU_LIST;
  gaoList = GAO_LIST;
  thocList = THOC_LIST;
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
  }

  redirect(url: string) {
    this.router.navigate([this.defaultUrl + url]);
  }
}
