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
import {CHUC_NANG} from "../../../../../constants/status";
import {DauGiaComponent} from "../../dau-gia.component";
@Component({
  selector: 'app-quyet-dinh',
  templateUrl: './quyet-dinh.component.html',
  styleUrls: ['./quyet-dinh.component.scss']
})

export class QuyetDinhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DANG_NHAP_DU_LIEU, giaTri: 'Đang nhập dữ liệu'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBdgService: QuyetDinhPdKhBdgService,
    private dauGiaComponent: DauGiaComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBdgService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      nam: null,
      soQdPd: null,
      trichYeu: null,
      loaiVthh: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      lastest: null,
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
    try {
      await this.spinner.show();
      await Promise.all([
        this.timKiem(),
        this.search(),
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      lastest: 0,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([this.timKiem(), this.search()]);
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
    return startValue.getTime() > this.formData.value.ngayKyQdDen.getTime();
  };

  disabledNgayKyQdDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyQdTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyQdTu.getTime();
  };
}
