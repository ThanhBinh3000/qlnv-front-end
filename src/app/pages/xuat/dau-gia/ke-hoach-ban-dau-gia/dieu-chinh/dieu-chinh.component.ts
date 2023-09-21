import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhDchinhKhBdgService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-dau-gia/dieuchinh-kehoach/quyetDinhDchinhKhBdg.service";
import {MESSAGE} from "../../../../../constants/message";
import {DauGiaComponent} from "../../dau-gia.component";
import {CHUC_NANG} from "../../../../../constants/status";

@Component({
  selector: 'app-dieu-chinh',
  templateUrl: './dieu-chinh.component.html',
  styleUrls: ['./dieu-chinh.component.scss']
})
export class DieuChinhComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.DA_LAP, giaTri: 'Đã lập' },
    { ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ Chối - LĐ Vụ' },
    { ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ Duyệt - LĐ Vụ' },
    { ma: this.STATUS.TU_CHOI_LDTC, giaTri: 'Từ Chối - LĐ Tổng Cục' },
    { ma: this.STATUS.CHO_DUYET_LDTC, giaTri: 'Chờ Duyệt - LĐ Tổng Cục' },
    { ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hanh' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDchinhKhBdgService: QuyetDinhDchinhKhBdgService,
    private dauGiaComponent: DauGiaComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDchinhKhBdgService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      nam: null,
      soQdDc: null,
      trichYeu: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      loaiVthh: null,
      maDvi: null,
    })

    this.filterTable = {
      nam: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdPd: '',
      trichYeu: '',
      tenCloaiVthh: '',
      slDviTsan: '',
      slHdongDaKy: '',
      thoiHanGiaoNhan: '',
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

  openModal(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModal() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledNgayKyQdDcTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayKyDcDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayKyDcDen.getTime();
  };

  disabledNgayKyQdDcDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKyDcTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKyDcTu.getTime();
  };
}
