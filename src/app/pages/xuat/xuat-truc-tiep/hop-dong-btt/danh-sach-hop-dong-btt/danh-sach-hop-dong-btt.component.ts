import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {MESSAGE} from 'src/app/constants/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QdPdKetQuaBttService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import {saveAs} from 'file-saver';
import {STATUS} from "../../../../../constants/status";
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {
  QuyetDinhPdKhBanTrucTiepService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-danh-sach-hop-dong-btt',
  templateUrl: './danh-sach-hop-dong-btt.component.html',
  styleUrls: ['./danh-sach-hop-dong-btt.component.scss']
})
export class DanhSachHopDongBttComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isQuanLy: boolean;
  isAddNew: boolean;
  check: boolean;
  phanLoai: string;
  listTrangThaiHd: any = [];
  listTrangThaiXh: any = [];
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idQdDc: number = 0;
  isViewQdDc: boolean = false;
  idQdKq: number = 0;
  isViewQdKq: boolean = false;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    this.formData = this.fb.group({
      namKh: null,
      soHopDong: null,
      tenHopDong: null,
      tenBenMua: null,
      ngayKyHopDongTu: null,
      ngayKyHopDongDen: null,
      trangThai: null,
      loaiVthh: null,
      lastest: null,
    });
    this.filterTable = {
      namKh: null,
      soQdPd: null,
      soQdKq: null,
      slHdChuaKy: null,
      slHdDaKy: null,
      ngayKthuc: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tongGiaTriHdong: null,
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
      await this.search();
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
      const [resKq, resKh] = await Promise.all([
        this.qdPdKetQuaBttService.search({
          loaiVthh: this.loaiVthh,
          trangThai: STATUS.DA_DUYET_LDC,
        }),
        this.quyetDinhPdKhBanTrucTiepService.search({
          loaiVthh: this.loaiVthh,
          trangThai: STATUS.BAN_HANH,
          lastest: 1
        })
      ]);
      const dataKq = resKq.data.content.map(item => {
        return {...item, check: true};
      });
      const dataKh = resKh.data.content.map(item => {
        return {...item, check: false};
      });
      const combinedData = [...dataKq,
        ...dataKh]
      if (combinedData) {
        this.dataTable = combinedData;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
            item.children = item.check ? item.children : item.children.filter(s => s.pthucBanTrucTiep === null);
          });
          this.dataTable = this.dataTable.filter(s => s.children.length > 0);
        }
        this.dataTableAll = cloneDeep(this.dataTable);
      } else {
        this.dataTable = [];
        this.notification.error(MESSAGE.ERROR, resKh.msg);
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id: number, boolean?: boolean, check?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.check = check;
    this.isQuanLy = boolean;
    this.isAddNew = !boolean;
    this.phanLoai = "QĐKQ";
  }

  exportDataHopDong(fileName?: string) {
    if (this.totalRecord <= 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    this.spinner.show();
    this.qdPdKetQuaBttService.exportHopDong(this.formData.value).subscribe(
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
      case 'pheDuyet':
        this.idQdPd = id;
        this.isViewQdPd = true;
        break;
      case 'dieuChinh':
        this.idQdDc = id;
        this.isViewQdDc = true;
        break;
      case 'ketQua':
        this.idQdKq = id;
        this.isViewQdKq = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'pheDuyet':
        this.idQdPd = null;
        this.isViewQdPd = false;
        break;
      case 'dieuChinh':
        this.idQdDc = null;
        this.isViewQdDc = false;
        break;
      case 'ketQua':
        this.idQdKq = null;
        this.isViewQdKq = false;
        break;
      default:
        break;
    }
  }

  disabledNgayKyHopDongTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyHopDongDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyHopDongDen.getFullYear(), this.formData.value.ngayKyHopDongDen.getMonth(), this.formData.value.ngayKyHopDongDen.getDate());
    return startDay > endDay;
  };

  disabledNgayKyHopDongDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyHopDongTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyHopDongTu.getFullYear(), this.formData.value.ngayKyHopDongTu.getMonth(), this.formData.value.ngayKyHopDongTu.getDate());
    return endDay < startDay;
  };
}
