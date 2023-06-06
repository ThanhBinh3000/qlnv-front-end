import {Component, Input, OnInit,} from '@angular/core';
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import { Router } from "@angular/router";
import {
  TongHopScThuongXuyenService
} from "../../../../../services/qlnv-kho/quy-hoach-ke-hoach/ke-hoach-sc-thuong-xuyen/tong-hop-sc-thuong-xuyen.service";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { Base2Component } from "../../../../../components/base2/base2.component";
import { MESSAGE } from "../../../../../constants/message";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-ke-hoach-danh-muc',
  templateUrl: './quyet-dinh-phe-duyet-ke-hoach-danh-muc.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-ke-hoach-danh-muc.component.scss']
})
export class QuyetDinhPheDuyetKeHoachDanhMucComponent extends Base2Component implements OnInit {

  selectedId: number = 0;
  isViewDetail: boolean;
  isDetail: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ duyệt lãnh đạo vụ'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ chối lãnh đạo vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã duyệt lãnh đạo vụ'},
    {ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ chối LĐ Tổng cục'},
    {ma: this.STATUS.DA_DUYET_LDTC, giaTri: 'Đã duyệt LĐ Tổng cục'},
  ];
  dataInput: any;
  idTongHop: number;
  isViewTh : boolean

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    public  qdScThuongXuyen: TongHopScThuongXuyenService,
    public router  :Router
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdScThuongXuyen)
    super.ngOnInit()
    this.filterTable = {};
  }

  async ngOnInit() {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT_KHSUACHUATX_QD')) {
      this.router.navigateByUrl('/error/401')
    }
    this.formData = this.fb.group({
      namKh: [''],
      maDvi : [''],
      soQuyetDinh : [''],
      trichYeu : [''],
      ngayKyTu : [''],
      ngayKyDen : [''],
      loai : ['01'],

    });
    this.filter();
  }

  filter() {
    if (this.formData.value.thoiGianTh && this.formData.value.thoiGianTh.length > 0) {
      this.formData.value.ngayThTu = this.formData.value.thoiGianTh[0];
      this.formData.value.ngayThDen = this.formData.value.thoiGianTh[1];
    }
    this.search();
  }

  redirectToChiTiet(id: number, isView?: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isViewDetail = isView ?? false;
  }

  async openModalCttongHop(data: any) {
    let body = {
      namKeHoach : data.namKeHoach,
      paggingReq: {
        limit: 1000,
        page: 0,
      },
      loai : '00'
    };
    let res = await this.qdScThuongXuyen.search(body);
    if (res.msg == MESSAGE.SUCCESS) {
      let listData = res.data.content;
      let result = listData.filter(item => item.soToTrinh == data.soToTrinh);
      if (result && result.length > 0) {
        this.idTongHop = result[0].id;
        this.isViewTh = true;
      }
    }
  }
  closeDxPaModal() {
    this.idTongHop = null;
    this.isViewTh = false;
  }


}
