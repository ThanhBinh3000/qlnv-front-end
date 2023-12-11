import { Component, OnInit } from '@angular/core';
import { Base2Component } from "../../../components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { QlDinhMucPhiService } from "../../../services/qlnv-kho/QlDinhMucPhi.service";
import dayjs from "dayjs";
import { MESSAGE } from "../../../constants/message";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-dinh-muc-trang-bi-cong-cu-dung-cu',
  templateUrl: './dinh-muc-trang-bi-cong-cu-dung-cu.component.html',
  styleUrls: ['./dinh-muc-trang-bi-cong-cu-dung-cu.component.scss']
})
export class DinhMucTrangBiCongCuDungCuComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    qlDinhMucPhiService: QlDinhMucPhiService,
    public router: Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, qlDinhMucPhiService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLĐMNXBQ_ĐMTBCCDC')) {
      this.router.navigateByUrl('/error/401')
    }
    this.formData = this.fb.group({
      soQd: [''],
      trangThai: [''],
      ngayKy: [''],
      ngayHieuLuc: [''],
      trichYeu: [''],
      capDvi: [''],
      loai: ['01'],
    });
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

  async xoaDieuKien() {
    this.formData.reset();
    this.formData.patchValue({
      loai : '01'
    })
    await this.search();
  }
}
