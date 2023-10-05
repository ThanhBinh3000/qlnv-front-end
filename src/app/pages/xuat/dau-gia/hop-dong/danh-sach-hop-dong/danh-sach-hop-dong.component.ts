import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { saveAs } from 'file-saver';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { DonviService } from "../../../../../services/donvi.service";
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss']
})
export class DanhSachHopDongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  dsDonvi: any[] = [];
  isQuanLy: boolean;
  isAddNew: boolean;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idQdPdKq: number = 0;
  isViewQdPdKq: boolean = false;
  listTrangThaiHd: any = [];
  listTrangThaiXh: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      nam: '',
      soHopDong: '',
      tenHopDong: '',
      maDvi: '',
      toChucCaNhan: '',
      ngayKyTu: '',
      ngayKyDen: '',
      trangThai: this.STATUS.BAN_HANH,
      loaiVthh: '',

    });
    this.filterTable = {
      nam: '',
      soQdPd: '',
      soQdKq: '',
      tongDviTsan: '',
      slDviTsanThanhCong: '',
      slHopDongDaKy: '',
      ngayKy: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenDvi: '',
      tongSlXuat: '',
      thanhTien: '',
      tenTrangThaiHd: '',
      tenTrangThaiXh: '',
    }
    this.listTrangThaiHd = [
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
    this.listTrangThaiXh = [
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
        this.search(),
        this.loadDsTong(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      const typeFilter = this.userService.isTongCuc() ? 'DV' : 'PB';
      this.dsDonvi = dsTong.data.filter(s => s.type === typeFilter);
    }
  }

  redirectDetail(id: number, boolean?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = boolean;
    this.isAddNew = !boolean;
  }

  exportDataHopDong(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      this.qdPdKetQuaBanDauGiaService.exportQdPd(this.formData.value)
        .subscribe(
          (blob) => {
            saveAs(blob, fileName || 'data.xlsx');
            this.spinner.hide();
          },
          (error) => {
            console.error('error: ', error);
            this.spinner.hide();
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          }
        );
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = id;
      this.isViewQdPd = true;
    } else if (modalType === 'QdPdKq') {
      this.idQdPdKq = id;
      this.isViewQdPdKq = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'QdPd') {
      this.idQdPd = null;
      this.isViewQdPd = false;
    } else if (modalType === 'QdPdKq') {
      this.idQdPdKq = null;
      this.isViewQdPdKq = false;
    }
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledStartNgayKy = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayKyDen, 'ngayKy');
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayKyTu, 'ngayKy');
  };
}
