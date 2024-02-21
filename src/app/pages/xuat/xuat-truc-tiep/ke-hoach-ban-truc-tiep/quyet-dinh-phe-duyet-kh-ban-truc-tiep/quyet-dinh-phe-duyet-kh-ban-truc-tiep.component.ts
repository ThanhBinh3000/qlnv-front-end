import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';
import {DataService} from "../../../../../services/data.service";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-kh-ban-truc-tiep',
  templateUrl: './quyet-dinh-phe-duyet-kh-ban-truc-tiep.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-kh-ban-truc-tiep.component.scss']
})

export class QuyetDinhPheDuyetKhBanTrucTiepComponent extends Base2Component implements OnInit {
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
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);
    this.formData = this.fb.group({
      namKh: null,
      soQdPd: null,
      trichYeu: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      loaiVthh: null,
      type: null,
    })
    this.filterTable = {
      namKh: null,
      soQdPd: null,
      ngayKyQd: null,
      trichYeu: null,
      soTrHdr: null,
      idThHdr: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      slDviTsan: null,
      tenTrangThai: null,
    };
    this.listTrangThai = [
      {
        value: this.STATUS.DU_THAO,
        text: 'Dự thảo'
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
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  redirectDetail(id, isView: boolean) {
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
