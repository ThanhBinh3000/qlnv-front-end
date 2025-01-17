import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {StorageService} from 'src/app/services/storage.service';
import {DonviService} from 'src/app/services/donvi.service';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {LOAI_HANG_DTQG} from 'src/app/constants/config';

@Component({
  selector: 'app-quyet-dinh-uy-quen-ban-le',
  templateUrl: './quyet-dinh-uy-quen-ban-le.component.html',
  styleUrls: ['./quyet-dinh-uy-quen-ban-le.component.scss']
})
export class QuyetDinhUyQuenBanLeComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG
  isView: boolean = false;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdDc: number = 0;
  isViewQdDc: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban Hành'},
  ];
  listPtBanTt: any[] = [
    {ma: '02', giaTri: 'Ủy Quyền'},
    {ma: '03', giaTri: 'Bán lẻ'},
  ]

  constructor(
    private httpClient: HttpClient,
    private donviService: DonviService,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: null,
      soDxuat: null,
      ngayTaoTu: null,
      ngayTaoDen: null,
      ngayDuyetTu: null,
      ngayDuyetDen: null,
      loaiVthh: null,
      pthucBanTrucTiep: null,
    });

    this.filterTable = {
      soQdPd: null,
      soDxuat: null,
      namKh: null,
      ngayPduyet: null,
      ngayNhanCgia: null,
      trichYeu: null,
      tenLoaiVthh: null,
      tenCloaiVthh: null,
      tongSoLuong: null,
      pthucBanTrucTiep: null,
      tenTrangThai: null,
    };
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        pthucBanTrucTiep: ['02', '03'],
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
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdDc':
        this.idQdDc = id;
        this.isViewQdDc = true;
        break;
      case 'DxKh':
        this.idDxKh = id;
        this.isViewDxKh = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'QdDc':
        this.idQdDc = null;
        this.isViewQdDc = false;
        break;
      case 'DxKh':
        this.idDxKh = null;
        this.isViewDxKh = false;
        break;
      default:
        break;
    }
  }

  disabledNgayTaoTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayTaoDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayTaoDen.getFullYear(), this.formData.value.ngayTaoDen.getMonth(), this.formData.value.ngayTaoDen.getDate());
    return startDay > endDay;
  };

  disabledNgayTaoDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayTaoTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayTaoTu.getFullYear(), this.formData.value.ngayTaoTu.getMonth(), this.formData.value.ngayTaoTu.getDate());
    return endDay < startDay;
  };

  disabledNgayDuyetTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayDuyetDen) {
      return false;
    }
    const startDay = new Date(startValue.getFullYear(), startValue.getMonth(), startValue.getDate());
    const endDay = new Date(this.formData.value.ngayDuyetDen.getFullYear(), this.formData.value.ngayDuyetDen.getMonth(), this.formData.value.ngayDuyetDen.getDate());
    return startDay > endDay;
  };

  disabledNgayDuyetDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayDuyetTu) {
      return false;
    }
    const endDay = new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate());
    const startDay = new Date(this.formData.value.ngayDuyetTu.getFullYear(), this.formData.value.ngayDuyetTu.getMonth(), this.formData.value.ngayDuyetTu.getDate());
    return endDay < startDay;
  };
}
