import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetdinhpheduyetduandtxdService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetduandtxd.service";
import dayjs from "dayjs";
import {
  QuyetdinhpheduyetTktcTdtService
} from "../../../../../services/qlnv-kho/tiendoxaydungsuachua/quyetdinhpheduyetTktcTdt.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-tktc-tdt',
  templateUrl: './quyet-dinh-phe-duyet-tktc-tdt.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-tktc-tdt.component.scss']
})
export class QuyetDinhPheDuyetTktcTdtComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    quyetdinhpheduyetTktcTdtService: QuyetdinhpheduyetTktcTdtService
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetdinhpheduyetTktcTdtService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      soQd: [''],
      tenDuAn: [''],
      chuDauTu: [''],
      soQdPdDtxd: [''],
      trangThai: [''],
      ngayKy: [''],
      trichYeu: [''],
    });
    this.filter();
  }

  filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = this.formData.value.ngayKy[0];
      this.formData.value.ngayKyDen = this.formData.value.ngayKy[1];
    }
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
