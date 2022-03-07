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
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  muoiList = MUOI_LIST;
  vatTuList = VAT_TU_LIST;
  luongThucList = LUONG_THUC_LIST;
  tabSelected: string = "luong-thuc";
  @Input() selectedIndex: number = 0;
  routerUrl: string = "";
  selectedTabNow: number = 0;

  constructor(
    private router: Router,
  ) {
    this.routerUrl = this.router.url;
  }

  ngOnInit(): void {
    this.selectedTabNow = this.selectedIndex;
  }

  redirect(url: string) {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    this.router.navigate([url]);
  }

  showDetailTab(tab: string) {
    if (this.tabSelected == tab) {
      this.isVisible = !this.isVisible;
      this.isVisibleChange.emit(this.isVisible);
    }
    else {
      this.isVisible = true;
      this.isVisibleChange.emit(this.isVisible);
    }
    this.tabSelected = tab;
    if (!this.isVisible) {
      this.selectedTabNow = this.selectedIndex;
    }
  }
}
