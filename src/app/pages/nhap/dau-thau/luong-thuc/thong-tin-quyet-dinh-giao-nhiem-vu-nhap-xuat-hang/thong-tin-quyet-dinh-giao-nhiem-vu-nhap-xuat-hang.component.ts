import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { TAB_SELECTED } from './../../../../ke-hoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam.constant';

@Component({
  selector: 'thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
  templateUrl:
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.html',
  styleUrls: [
    './thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongTinGiaoNhiemVuNhapXuatHangComponent implements OnInit {
  tabSelected: string = TAB_SELECTED.luongThuc;
  tab = TAB_SELECTED;
  visibleTab: boolean = false;
  isVisibleChangeTab$ = new Subject();

  constructor(
    private router: Router,
    private routerActive: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private helperService: HelperService,
  ) {}

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  reactToDonViThuchienQuyetDinh() {
    //'/nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
    this.router.navigate([
      'nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang/thong-tin-quyet-dinh-giao-nhiem-vu-nhap-xuat-hang',
      0,
      'chi-tiet-don-vi-thuc-hien-quyet-dinh',
      0,
    ]);
  }
  back() {
    this.router.navigate(['/nhap/dau-thau/quyet-dinh-giao-nhiem-vu-nhap-hang']);
  }
  tuChoi() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
      }
    });
  }
}
