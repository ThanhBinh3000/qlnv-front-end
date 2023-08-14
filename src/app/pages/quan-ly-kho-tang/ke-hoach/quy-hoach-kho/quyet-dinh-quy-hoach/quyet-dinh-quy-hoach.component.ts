import {Component, Input, OnInit,} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {QuyHoachKhoService} from "../../../../../services/quy-hoach-kho.service";
import {Router} from "@angular/router";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {DanhMucService} from "../../../../../services/danhmuc.service";

@Component({
  selector: 'app-quyet-dinh-quy-hoach',
  templateUrl: './quyet-dinh-quy-hoach.component.html',
  styleUrls: ['./quyet-dinh-quy-hoach.component.scss']
})
export class QuyetDinhQuyHoachComponent extends Base2Component implements OnInit {
  @Input() type : string;
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
   listVungMien: any[] = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyHoachKhoService: QuyHoachKhoService,
    private router: Router,
    private danhMucService: DanhMucService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyHoachKhoService)
    super.ngOnInit();
    this.formData = this.fb.group({
      maDvi: [null],
      soQuyetDinh: [null],
      namKeHoach: [null],
      soCongVan: [null],
      ngayKyTu: [null],
      ngayKyDen: [null],
      namBatDau: [null],
      namKetThuc: [null],
      vungMien: [null],
      diaDiemKho: [null],
      loai: ['00'],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_QHK_QDQH')) {
      this.router.navigateByUrl('/error/401')
    }
    this.spinner.show();
    try {
      this.getListVungMien();
      this.search();
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
  redirectToChiTiet(id: number, isView?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async getListVungMien() {
    this.listVungMien = [];
    let res = await this.danhMucService.danhMucChungGetAll('VUNG_MIEN');
    if (res.msg == MESSAGE.SUCCESS) {
      this.listVungMien = res.data;
    }
  }
}
