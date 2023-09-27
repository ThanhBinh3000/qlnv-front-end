import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {
  DeXuatKhBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/deXuatKhBanDauGia.service';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {CHUC_NANG} from "../../../../../constants/status";
import {DauGiaComponent} from "../../dau-gia.component";
@Component({
  selector: 'app-de-xuat',
  templateUrl: './de-xuat.component.html',
  styleUrls: ['./de-xuat.component.scss']
})

export class DeXuatComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: DauGiaComponent;
  isView = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  idChiTieu: number = 0;
  isViewChiTieu: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.TU_CHOI_TP, giaTri: 'Từ chối - TP'},
    {ma: this.STATUS.CHO_DUYET_TP, giaTri: 'Đã Chờ duyệt - TP'},
    {ma: this.STATUS.CHO_DUYET_LDC, giaTri: 'Chờ duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_LDC, giaTri: 'Từ chối - LĐ Cục'},
    {ma: this.STATUS.DA_DUYET_LDC, giaTri: 'Đã duyệt - LĐ Cục'},
    {ma: this.STATUS.TU_CHOI_CBV, giaTri: 'Từ chối - CB Vụ'},
    {ma: this.STATUS.DA_DUYET_CBV, giaTri: 'Đã duyệt - CB Vụ'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private deXuatKhBanDauGiaService: DeXuatKhBanDauGiaService,
    private dauGiaComponent: DauGiaComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, deXuatKhBanDauGiaService);
    this.vldTrangThai = this.dauGiaComponent;
    this.formData = this.fb.group({
      namKh: null,
      soDxuat: null,
      loaiVthh: null,
      trichYeu: null,
      maDvi: null,
      trangThaiList: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayDuyetTu: null,
      ngayDuyetDen: null,
    });

    this.filterTable = {
      namKh: '',
      soDxuat: '',
      ngayTao: '',
      ngayPduyet: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      tenCloaiVthh: '',
      slDviTsan: '',
      slHdDaKy: '',
      soQdCtieu: '',
      tenTrangThai: '',
      tenTrangThaiTh: '',
      idThop: '',
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

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      trangThaiList: this.userService.isTongCuc() ? [this.STATUS.DA_DUYET_LDC, this.STATUS.DA_DUYET_CBV, this.STATUS.TU_CHOI_CBV] : null
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
    switch (modalType) {
      case 'Thop':
        this.idThop = id;
        this.isViewThop = true;
        break;
      case 'ChiTieu':
        this.idChiTieu = id;
        this.isViewChiTieu = true;
        break;
      case 'QdPd':
        this.idQdPd = id;
        this.isViewQdPd = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'Thop':
        this.idThop = null;
        this.isViewThop = false;
        break;
      case 'ChiTieu':
        this.idChiTieu = null;
        this.isViewChiTieu = false;
        break;
      case 'QdPd':
        this.idQdPd = null;
        this.isViewQdPd = false;
        break;
      default:
        break;
    }
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayTaoDen.getTime();
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayTaoTu.getTime();
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayDuyetDen.getTime();
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayDuyetTu.getTime();
  };
}
