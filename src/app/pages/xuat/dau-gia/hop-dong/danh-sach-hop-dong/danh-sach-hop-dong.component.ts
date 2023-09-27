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

@Component({
  selector: 'app-danh-sach-hop-dong',
  templateUrl: './danh-sach-hop-dong.component.html',
  styleUrls: ['./danh-sach-hop-dong.component.scss']
})
export class DanhSachHopDongComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuanLy: boolean;
  isAddNew: boolean;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  idQdPdKq: number = 0;
  isViewQdPdKq: boolean = false;
  listTrangThaiHd: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];
  listTrangThaiXh: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'}
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBanDauGiaService: QdPdKetQuaBanDauGiaService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBanDauGiaService);
    this.formData = this.fb.group({
      ngayKy: '',
      ngayKyTu: '',
      ngayKyDen: '',
      soHd: '',
      tenHd: '',
      nhaCungCap: '',
      trangThai: this.STATUS.BAN_HANH,
      loaiVthh: '',
      nam: '',
      tenDviThucHien: '',
      tenDviMua: '',
      maDvi: ''
    });
    this.filterTable = {
      nam: '',
      soQdPd: '',
      soQdKq: '',
      tongDvts: '',
      tongDvtsDg: '',
      slHdDaKy: '',
      thoiHanTt: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tenDviThucHien: '',
      tenDviMua: '',
      soLuong: '',
      thanhTien: '',
    }
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userInfo.MA_DVI,
      });

      await this.spinner.show();
      await this.search();
    } catch (e) {
      console.error('error:', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  goDetail(id: number, boolean?: boolean) {
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

  disabledStartNgayKy = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKyDen) {
      return startValue.getTime() >= this.formData.value.ngayKyDen.getTime();
    }
    return false;
  };

  disabledEndNgayKy = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyTu.getTime();
  };
}
