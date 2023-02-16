
import {Component, Input, OnInit} from '@angular/core';
import dayjs from 'dayjs';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../services/storage.service";
import {QlDinhMucPhiService} from "../../../../services/qlnv-kho/QlDinhMucPhi.service";
import {Base2Component} from "../../../../components/base2/base2.component";

@Component({
  selector: 'app-mm-dinh-muc-trang-bi',
  templateUrl: './mm-dinh-muc-trang-bi.component.html',
  styleUrls: ['./mm-dinh-muc-trang-bi.component.scss']
})
export class MmDinhMucTrangBiComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.formData = this.fb.group({
      soQd: [''],
      trangThai: [''],
      ngayKy: [''],
      ngayHieuLuc: [''],
      trichYeu: [''],
      capDvi: [null],
      loai: ['02'],
    });
    this.filterTable = {};
  }

  async ngOnInit() {
    await this.filter();
  }

  async filter() {
    if (this.formData.value.ngayKy && this.formData.value.ngayKy.length > 0) {
      this.formData.value.ngayKyTu = dayjs(this.formData.value.ngayKy[0]).format('DD/MM/YYYY');
      this.formData.value.ngayKyDen = dayjs(this.formData.value.ngayKy[1]).format('DD/MM/YYYY');
    }
    if (this.formData.value.ngayHieuLuc && this.formData.value.ngayHieuLuc.length > 0) {
      this.formData.value.ngayHieuLucTu = dayjs(this.formData.value.ngayHieuLuc[0]).format('DD/MM/YYYY');
      this.formData.value.ngayHieuLucDen = dayjs(this.formData.value.ngayHieuLuc[1]).format('DD/MM/YYYY');
    }
    await this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }
}
