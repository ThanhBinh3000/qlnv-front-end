import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserLogin } from 'src/app/models/userlogin';
import { UserService } from 'src/app/services/user.service';
import { LEVEL } from 'src/app/constants/config';

@Component({
  selector: 'thong-tin-dau-thau',
  templateUrl: './thong-tin-dau-thau.component.html',
  styleUrls: ['./thong-tin-dau-thau.component.scss'],
})
export class ThongTinDauThauComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = false;

  lastBreadcrumb: string;
  userInfo: UserLogin;

  selectedTab: string = 'thong-tin';

  constructor(
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserLogin();
    if (this.router.url.includes(LEVEL.TONG_CUC)) {
      this.lastBreadcrumb = LEVEL.TONG_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CHI_CUC)) {
      this.lastBreadcrumb = LEVEL.CHI_CUC_SHOW;
    } else if (this.router.url.includes(LEVEL.CUC)) {
      this.lastBreadcrumb = LEVEL.CUC_SHOW;
    }
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  redirectToChiTiet() {
    this.router.navigate(['/mua-hang/dau-thau/thoc/nhap-thong-tin-dau-thau-cuc/thong-tin-nhap-thong-tin-dau-thau-cuc', 1]);
  }

  selectTabMenu(tab) {
    if (tab == this.selectedTab) {
      return;
    }
    if (tab == 'thong-tin') {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/nhap-thong-tin-dau-thau-cuc',
      ]);
    } else if (tab == 'ket-qua') {
      this.router.navigate([
        '/mua-hang/dau-thau/thoc/nhap-quyet-dinh-ket-qua-nha-thau-cuc',
      ]);
    }
  }
}
