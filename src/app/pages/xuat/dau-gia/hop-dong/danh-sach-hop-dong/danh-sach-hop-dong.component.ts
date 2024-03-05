import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QdPdKetQuaBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import {saveAs} from 'file-saver';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DonviService} from "../../../../../services/donvi.service";
import {isEmpty} from 'lodash';
import {STATUS} from "../../../../../constants/status";

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
      nam: null,
      soHopDong: null,
      tenHopDong: null,
      maDvi: null,
      toChucCaNhan: null,
      ngayKyTu: null,
      ngayKyDen: null,
      trangThai: null,
      loaiVthh: null,

    });
    this.filterTable = {
      nam: null,
      soQdPd: null,
      soQdKq: null,
      tongDviTsan: null,
      slDviTsanThanhCong: null,
      slHopDongDaKy: null,
      ngayKy: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tenDvi: null,
      tongSlXuat: null,
      thanhTien: null,
      tenTrangThaiHd: null,
      tenTrangThaiXh: null,
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
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        trangThai: STATUS.BAN_HANH
      });
      await this.search();
      await this.loadDsTong();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      this.spinner.hide();
    }
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      const typeFilter = this.userService.isTongCuc() ? 'DV' : 'PB';
      this.dsDonvi = dsTong.data.filter(s => s.type === typeFilter);
    }
  }

  redirectDetail(id: number, boolean?: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
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

  disabledStartNgayKyTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyDen.getFullYear(), this.formData.value.ngayKyDen.getMonth(), this.formData.value.ngayKyDen.getDate());
    return startDay > endDay;
  };

  disabledEndNgayKyDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyTu.getFullYear(), this.formData.value.ngayKyTu.getMonth(), this.formData.value.ngayKyTu.getDate());
    return endDay < startDay;
  };
}
