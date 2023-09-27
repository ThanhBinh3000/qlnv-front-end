import {Component, Input, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  QuyetDinhDcBanttService
} from "../../../../../services/qlnv-hang/xuat-hang/ban-truc-tiep/dieuchinh-kehoach-bantt/quyet-dinh-dc-bantt.service";
import {UserService} from "../../../../../services/user.service";
import {MESSAGE} from "../../../../../constants/message";
import {CHUC_NANG} from "../../../../../constants/status";
import {XuatTrucTiepComponent} from "../../xuat-truc-tiep.component";

@Component({
  selector: 'app-dieu-chinh-ban-truc-tiep',
  templateUrl: './dieu-chinh-ban-truc-tiep.component.html',
  styleUrls: ['./dieu-chinh-ban-truc-tiep.component.scss']
})
export class DieuChinhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTrucTiepComponent
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
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
    private xuatTrucTiepComponent: XuatTrucTiepComponent,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.vldTrangThai = this.xuatTrucTiepComponent;
    this.formData = this.fb.group({
      namKh: null,
      soQdDc: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      trichYeu: null,
      loaiVthh: null,
    })

    this.filterTable = {
      namKh: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdPd: '',
      trichYeu: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
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
