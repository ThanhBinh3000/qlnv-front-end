import { Component, Input, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { QuyetDinhPdKhBdgService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})
export class QuyetDinhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  idThop: number = 0;
  isViewThop: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  listTrangThai: any[] = [
    { ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      namKh: dayjs().get('year'),
      soQdPd: null,
      trichYeu: null,
      loaiVthh: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      lastest: 0,
      trangThai: null,
    })
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      soDviTsan: '',
      slHdDaKy: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await this.search();
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      lastest: 0,
      trangThai: this.userService.isCuc() ? this.STATUS.BAN_HANH : null
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  openModalDxKh(id: number) {
    this.idDxKh = id;
    this.isViewDxKh = true;
  }

  closeModalDxKh() {
    this.idDxKh = null;
    this.isViewDxKh = false;
  }

  openModalTh(id: number) {
    this.idThop = id;
    this.isViewThop = true;
  }

  closeModalTh() {
    this.idThop = null;
    this.isViewThop = false;
  }


  disabledNgayKyQdTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyQdDen.getTime();
  };

  disabledNgayKyQdDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdTu.getTime();
  };

}
