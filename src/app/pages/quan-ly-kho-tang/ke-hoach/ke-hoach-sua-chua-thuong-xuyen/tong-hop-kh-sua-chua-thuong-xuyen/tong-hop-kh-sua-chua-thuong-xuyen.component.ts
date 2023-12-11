import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  DeXuatScThuongXuyenService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";
import {Base2Component} from "../../../../../components/base2/base2.component";
import {
  TongHopScThuongXuyenService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/tong-hop-sc-thuong-xuyen.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-tong-hop-kh-sua-chua-thuong-xuyen',
  templateUrl: './tong-hop-kh-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./tong-hop-kh-sua-chua-thuong-xuyen.component.scss']
})
export class TongHopKhSuaChuaThuongXuyenComponent extends Base2Component implements OnInit {
  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  isApprove: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt lãnh đạo vụ'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối lãnh đạo vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt lãnh đạo vụ'},
    {ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối LĐ Tổng cục'},
    {ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt LĐ Tổng cục'},
  ];
  openQdPd: boolean;
  idQdPdKhDm: number;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    deXuatScThuongXuyenService: DeXuatScThuongXuyenService,
    tongHopScThuongXuyenService: TongHopScThuongXuyenService,
    public router  :Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopScThuongXuyenService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUATX_TH')) {
      this.router.navigateByUrl('/error/401')
    }
    this.formData = this.fb.group({
      namKh: [''],
      maTongHop: [''],
      noiDungTh: [''],
      trangThai: [''],
      ngayThTu: [''],
      ngayThDen: [''],
      loai : ['00']
    });
    this.filter();
  }

  filter() {
    // if (this.formData.value.thoiGianTh && this.formData.value.thoiGianTh.length > 0) {
    //   this.formData.value.ngayThTu = this.formData.value.thoiGianTh[0];
    //   this.formData.value.ngayThDen = this.formData.value.thoiGianTh[1];
    // }
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean, isApprove?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isApprove = isApprove
    this.isViewDetail = isView ?? false;
  }
  openQdPdModal(id: number) {
    this.idQdPdKhDm = id;
    this.openQdPd = true;
  }

  closeQdPdModal() {
    this.idQdPdKhDm = null;
    this.openQdPd = false;
  }


}
