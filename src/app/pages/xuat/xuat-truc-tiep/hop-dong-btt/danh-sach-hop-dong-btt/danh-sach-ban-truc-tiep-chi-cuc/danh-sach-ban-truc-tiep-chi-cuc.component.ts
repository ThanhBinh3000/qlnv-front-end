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
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-danh-sach-ban-truc-tiep-chi-cuc',
  templateUrl: './danh-sach-ban-truc-tiep-chi-cuc.component.html',
  styleUrls: ['./danh-sach-ban-truc-tiep-chi-cuc.component.scss']
})
export class DanhSachBanTrucTiepChiCucComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuanLy: boolean;
  isAddNew: boolean;

  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện'},
    {ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện'},
    {ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành'},
  ];

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
      soHd: null,
      tenHd: null,
      ngayPduyetTu: null,
      ngayPduyetDen: null,
      loaiVthh: null,
      trangThai: null,
      pthucBanTrucTiep: null,
      lastest: 1
    });
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayMkho: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThaiHd: '',
    }
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await Promise.all([
        this.search(),
      ]);
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.HOAN_THANH_CAP_NHAT,
      pthucBanTrucTiep: ['02']
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  goDetail(id: number, boolean?: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isQuanLy = boolean;
    this.isAddNew = !boolean;
  }

  exportDataHdong(fileName?: string) {
    if (this.totalRecord > 0) {
      this.spinner.show();
      try {
        this.chaoGiaMuaLeUyQuyenService
          .exportHopDong(this.formData.value)
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

  disabledNgayPduyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayPduyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayPduyetDen.getTime();
  };

  disabledNgayPduyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayPduyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayPduyetTu.getTime();
  };
}
