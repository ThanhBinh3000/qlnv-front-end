import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {STATUS} from 'src/app/constants/status';
import {
  ChaoGiaMuaLeUyQuyenService
} from "../../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service";
import {saveAs} from 'file-saver';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-danh-sach-ban-truc-tiep-chi-cuc',
  templateUrl: './danh-sach-ban-truc-tiep-chi-cuc.component.html',
  styleUrls: ['./danh-sach-ban-truc-tiep-chi-cuc.component.scss']
})
export class DanhSachBanTrucTiepChiCucComponent extends Base2Component implements OnInit {
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  @Input() loaiVthh: string;
  isQuanLy: boolean;
  isAddNew: boolean;
  listTrangThaiHd: any = [];
  listTrangThaiXh: any = [];
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdDc: number = 0;
  isViewQdDc: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: null,
      soHopDong: null,
      tenHopDong: null,
      ngayPduyetTu: null,
      ngayPduyetDen: null,
      loaiVthh: null,
      trangThai: null,
      pthucBanTrucTiep: null,
      lastest: null,
    });
    this.filterTable = {
      namKh: null,
      soQdPd: null,
      slHdChuaKy: null,
      slHdDaKy: null,
      tgianDkienDen: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      thanhTienDuocDuyet: null,
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
        pthucBanTrucTiep: ['02'],
      })
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async search() {
    try {
      await this.spinner.show();
      const body = this.formData.value;
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      };
      const res = await this.chaoGiaMuaLeUyQuyenService.search(body);
      if (res.msg === MESSAGE.SUCCESS) {
        const data = res.data;
        this.dataTable = data.content.filter(item =>
          item.xhQdPdKhBttHdr.lastest || item.trangThai === STATUS.DA_HOAN_THANH).map(item => {
          item.checked = false;
          return item;
        });
        this.totalRecord = data.totalElements;
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

  redirectDetail(id: number, boolean?: boolean) {
    if (id === 0 && this.checkPrice && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (id === 0 && this.checkPrice && this.checkPrice.booleanNhapXuat) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgNhapXuat);
      return;
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = boolean;
    this.isAddNew = !boolean;
  }

  exportDataHopDong(fileName?: string) {
    if (this.totalRecord <= 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    this.spinner.show();
    this.chaoGiaMuaLeUyQuyenService.exportHopDong(this.formData.value).subscribe(
      (blob) => {
        saveAs(blob, fileName ? fileName : 'data.xlsx');
      }, (error) => {
        console.error('error: ', error);
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }, () => {
        this.spinner.hide();
      }
    );
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdDc':
        this.idQdDc = id;
        this.isViewQdDc = true;
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
        this.idQdDc = null;
        this.isViewQdDc = false;
        break;
      default:
        break;
    }
  }

  disabledNgayPduyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayPduyetDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayPduyetDen.getFullYear(), this.formData.value.ngayPduyetDen.getMonth(), this.formData.value.ngayPduyetDen.getDate());
    return startDay > endDay;
  };

  disabledNgayPduyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayPduyetTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayPduyetTu.getFullYear(), this.formData.value.ngayPduyetTu.getMonth(), this.formData.value.ngayPduyetTu.getDate());
    return endDay < startDay;
  };
}
