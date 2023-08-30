import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/tochuc-trienkhai/qdPdKetQuaBanDauGia.service';
import { saveAs } from 'file-saver';
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
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' }
  ];
  listTrangThaiXh: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' }
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
  async ngOnInit() {
    await this.spinner.show();
    console.log(this.userInfo.MA_DVI, "MA_DVI")
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userInfo.MA_DVI,
      })

      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  goDetail(id: number, roles?: any, isQuanLy?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = isQuanLy;
    this.isAddNew = !isQuanLy;
  }

  exportQdPd(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.qdPdKetQuaBanDauGiaService
          .exportQdPd(this.formData.value)
          .subscribe((blob) =>
            saveAs(blob, fileName ? fileName : 'data.xlsx'),
          );
        this.spinner.hide();
      } catch (e) {
        console.log('error: ', e);
        this.spinner.hide();
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  openModalQdPdKq(id: number) {
    this.idQdPdKq = id;
    this.isViewQdPdKq = true;
  }

  closeModalQdPdKq() {
    this.idQdPdKq = null;
    this.isViewQdPdKq = false;
  }
}
