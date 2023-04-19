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
import {
  DeXuatScThuongXuyenService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/de-xuat-sc-thuong-xuyen.service";

@Component({
  selector: 'app-de-xuat-ke-hoach-sua-chua-thuong-xuyen',
  templateUrl: './de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.html',
  styleUrls: ['./de-xuat-ke-hoach-sua-chua-thuong-xuyen.component.scss']
})
export class DeXuatKeHoachSuaChuaThuongXuyenComponent extends Base2Component implements OnInit {
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
    deXuatScThuongXuyenService: DeXuatScThuongXuyenService
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatScThuongXuyenService)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    this.formData = this.fb.group({
      namKh: [''],
      soCv: [''],
      tenCongTrinh: [''],
      diaDiem: [''],
      trangThai: [''],
      ngayKy: [''],
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