import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-bao-cao-nghiep-vu-qly-kho',
  templateUrl: './bao-cao-nghiep-vu-qly-kho.component.html',
  styleUrls: ['./bao-cao-nghiep-vu-qly-kho.component.scss']
})
export class BaoCaoNghiepVuQlyKhoComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = this.renderTab();
  renderTab(): number {
    if (this.userService.isAccessPermisson('KTBC_NVQLKT_HTCTSCK')) {
      return 0
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_RSTLK')) {
      return 1
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_PBHTKT')) {
      return 2
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_THDMVTTB')) {
      return 3
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_NCPVC')) {
      return 4
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_TTMMTB')) {
      return 5
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_DMMMTB')) {
      return 6
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_DMDTPVC')) {
      return 7
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_HTKTBD')) {
      return 8
    } else if (this.userService.isAccessPermisson('KTBC_NVQLKT_HTKTDB')) {
      return 9
    }
  }
  selectTab(tab: number) {
    this.tabSelected = tab;
  }

}
