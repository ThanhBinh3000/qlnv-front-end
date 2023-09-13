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

@Component({
  selector: 'app-danh-sach-hop-dong-btt',
  templateUrl: './danh-sach-hop-dong-btt.component.html',
  styleUrls: ['./danh-sach-hop-dong-btt.component.scss']
})
export class DanhSachHopDongBttComponent extends Base2Component implements OnInit {
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
    private qdPdKetQuaBttService: QdPdKetQuaBttService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    this.formData = this.fb.group({
      namKh: null,
      soHd: null,
      tenHd: null,
      tenDviMua: null,
      ngayPduyetTu: null,
      ngayPduyetDen: null,
      trangThai: null,
      loaiVthh: null,
      maDvi: null,
      maChiCuc: null,
    });
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      soQdKq: '',
      ngayMkho: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      tenTrangThaiHd: '',
      tenTrangThaiXh: '',
    }
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
      ]);
    } catch (e) {
      console.error('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThai: STATUS.BAN_HANH
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([
      this.timKiem(),
      this.search()
    ]);
  }

  goDetail(id: number, boolean?: boolean) {
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
