import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {
  QuyetDinhPdKhBdgService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/quyetDinhPdKhBdg.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DataService} from "../../../../../services/data.service";

@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})

export class QuyetDinhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  isView = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private dataService: DataService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.formData = this.fb.group({
      nam: null,
      soQdPd: null,
      trichYeu: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      loaiVthh: null,
      type: null,
    });

    this.filterTable = {
      nam: null,
      soQdPd: null,
      ngayKyQd: null,
      trichYeu: null,
      soTrHdr: null,
      idThHdr: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      soDviTsan: null,
      tenTrangThai: null,
    };

    this.listTrangThai = [
      {
        value: this.STATUS.DANG_NHAP_DU_LIEU,
        text: 'Đang nhập dữ liệu'
      },
      {
        value: this.STATUS.BAN_HANH,
        text: 'Ban hành'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await this.dataService.currentData.subscribe(data => {
        if (data && data.isQuyetDinh) {
          this.redirectDetail(0, false);
          this.dataInit = {...data};
        }
      });
      await this.dataService.removeData();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        type: 'QDKH'
      })
      await this.search();
      await this.checkPriceAdjust('xuất hàng');
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, isView: boolean) {
    if (id === 0 && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    if (modalType === 'DxKh') {
      this.idDxKh = id;
      this.isViewDxKh = true;
    } else if (modalType === 'Thop') {
      this.idThop = id;
      this.isViewThop = true;
    }
  }

  closeModal(modalType: string) {
    if (modalType === 'DxKh') {
      this.idDxKh = null;
      this.isViewDxKh = false;
    } else if (modalType === 'Thop') {
      this.idThop = null;
      this.isViewThop = false;
    }
  }

  disabledNgayKyQdTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyQdDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayKyQdDen.getFullYear(), this.formData.value.ngayKyQdDen.getMonth(), this.formData.value.ngayKyQdDen.getDate());
    return startDay > endDay;
  };

  disabledNgayKyQdDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayKyQdTu.getFullYear(), this.formData.value.ngayKyQdTu.getMonth(), this.formData.value.ngayKyQdTu.getDate());
    return endDay < startDay;
  };

  removeDataInit() {
    this.dataInit = {};
  }
}
