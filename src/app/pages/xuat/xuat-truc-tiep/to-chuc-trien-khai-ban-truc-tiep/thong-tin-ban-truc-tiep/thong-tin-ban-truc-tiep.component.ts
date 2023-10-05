import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { cloneDeep } from 'lodash';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';

@Component({
  selector: 'app-thong-tin-ban-truc-tiep',
  templateUrl: './thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-ban-truc-tiep.component.scss']
})
export class ThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  dsDonvi: any[] = [];
  userdetail: any = {};
  isView: boolean = false;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdPdDc: number = 0;
  isViewQdPdDc: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  idQdPdKq: number = 0;
  isViewQdPdKq: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.formData = this.fb.group({
      namKh: null,
      ngayCgiaTu: null,
      ngayCgiaDen: null,
      tochucCanhan: null,
      maChiCuc: null,
      loaiVthh: null,
    })
    this.filterTable = {
      soQdPd: '',
      pthucBanTrucTiep: '',
      ngayNhanCgia: '',
      soQdKq: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThai: '',
    };
    this.listTrangThai = [
      {
        value: this.STATUS.CHUA_THUC_HIEN,
        text: 'Chưa thực hiện'
      },
      {
        value: this.STATUS.DANG_THUC_HIEN,
        text: 'Đang thực hiện'
      },
      {
        value: this.STATUS.DA_HOAN_THANH,
        text: 'Đã hoàn thành'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.searchThongTin(),
        this.initData()
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (isEmpty(dsTong)) return;
    this.dsDonvi = dsTong.data;
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await this.timKiem();
    await this.searchThongTin();
  }

  async searchThongTin() {
    try {
      await this.spinner.show();
      const body = {
        ...this.formData.value,
      };
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const data = res.data;
        const soDxuatMap = {};
        const filteredRecords = [];
        data.content.forEach(record => {
          if (!soDxuatMap[record.soDxuat]) {
            filteredRecords.push(record);
            soDxuatMap[record.soDxuat] = true;
          } else if (record.isDieuChinh) {
            const index = filteredRecords.findIndex(existingRecord => existingRecord.soDxuat === record.soDxuat);
            if (index !== -1) {
              filteredRecords[index] = record;
            }
          }
        });
        this.dataTable = filteredRecords;
        this.totalRecord = data.totalElements;
        this.dataTable?.forEach((item) => (item.checked = false));
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
        this.notification.error(MESSAGE.ERROR, res.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async showListThongTin() {
    this.isDetail = false;
    await this.searchThongTin();
    this.showListEvent.emit();
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdDc':
        this.idQdPdDc = id;
        this.isViewQdPdDc = true;
        break;
      case 'DxKh':
        this.idDxKh = id;
        this.isViewDxKh = true;
        break;
      case 'QdKq':
        this.idQdPdKq = id;
        this.isViewQdPdKq = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'QdDc':
        this.idQdPdDc = null;
        this.isViewQdPdDc = false;
        break;
      case 'DxKh':
        this.idDxKh = null;
        this.isViewDxKh = false;
        break;
      case 'QdKq':
        this.idQdPdKq = null;
        this.isViewQdPdKq = false;
        break;
      default:
        break;
    }
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayChaoGiaTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayCgiaDen, 'ngayCgia');
  };

  disabledNgayChaoGiaDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayCgiaTu, 'ngayCgia');
  };
}
