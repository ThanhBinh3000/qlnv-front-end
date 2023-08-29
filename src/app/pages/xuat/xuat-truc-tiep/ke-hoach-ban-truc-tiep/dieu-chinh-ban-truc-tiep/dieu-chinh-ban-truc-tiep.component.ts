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

@Component({
  selector: 'app-dieu-chinh-ban-truc-tiep',
  templateUrl: './dieu-chinh-ban-truc-tiep.component.html',
  styleUrls: ['./dieu-chinh-ban-truc-tiep.component.scss']
})
export class DieuChinhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;

  idQdPdGoc: number = 0;
  isViewQdPdGoc: boolean = false;

  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_LDV, giaTri: 'Từ Chối - LĐ Vụ'},
    {ma: this.STATUS.CHO_DUYET_LDV, giaTri: 'Chờ Duyệt - LĐ Vụ'},
    {ma: this.STATUS.DA_DUYET_LDV, giaTri: 'Đã Duyệt - LĐ Vụ'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hanh'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhDcBanttService: QuyetDinhDcBanttService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhDcBanttService);
    this.formData = this.fb.group({
      namKh: null,
      soQdDc: null,
      ngayKyDcTu: null,
      ngayKyDcDen: null,
      trichYeu: null,
      loaiVthh: null,
      trangThai: null,
    })

    this.filterTable = {
      namKh: '',
      soQdDc: '',
      ngayKyDc: '',
      soQdGoc: '',
      trichYeu: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
      tenTrangThai: '',
    };

  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      this.timKiem();
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThai: this.userService.isCuc() ? this.STATUS.BAN_HANH : null
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
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

  openModalQdPdGoc(id: number) {
    this.idQdPdGoc = id;
    this.isViewQdPdGoc = true;
  }

  closeModalQdPdGoc() {
    this.idQdPdGoc = null;
    this.isViewQdPdGoc = false;
  }
}
