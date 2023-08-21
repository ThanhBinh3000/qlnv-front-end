import {Component, Input, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NgxSpinnerService} from 'ngx-spinner';
import {MESSAGE} from 'src/app/constants/message';
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {CHUC_NANG} from "../../../../../constants/status";
import {
  QuyetDinhPdKhBanTrucTiepService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/de-xuat-kh-btt/quyet-dinh-pd-kh-ban-truc-tiep.service';
import {XuatTrucTiepComponent} from "../../xuat-truc-tiep.component";

@Component({
  selector: 'app-quyet-dinh-phe-duyet-kh-ban-truc-tiep',
  templateUrl: './quyet-dinh-phe-duyet-kh-ban-truc-tiep.component.html',
  styleUrls: ['./quyet-dinh-phe-duyet-kh-ban-truc-tiep.component.scss']
})

export class QuyetDinhPheDuyetKhBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTrucTiepComponent
  isView = false;
  idThop: number = 0;
  isViewThop: boolean = false;
  idDxKh: number = 0;
  isViewDxKh: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.DU_THAO, giaTri: 'Dự thảo'},
    {ma: this.STATUS.BAN_HANH, giaTri: 'Ban hành'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private quyetDinhPdKhBanTrucTiepService: QuyetDinhPdKhBanTrucTiepService,
    private xuatTrucTiepComponent: XuatTrucTiepComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPdKhBanTrucTiepService);
    this.vldTrangThai = this.xuatTrucTiepComponent;
    this.formData = this.fb.group({
      namKh: null,
      soQdPd: null,
      trichYeu: null,
      ngayKyQdTu: null,
      ngayKyQdDen: null,
      soTrHdr: null,
      trangThai: null,
      loaiVthh: null,
      lastest: 0
    })
    this.filterTable = {
      namKh: '',
      soQdPd: '',
      ngayKyQd: '',
      trichYeu: '',
      soTrHdr: '',
      idThHdr: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      slDviTsan: '',
      soHopDong: '',
      trangThai: '',
      tenTrangThai: '',
    };
  }

  async ngOnInit() {
    await this.spinner.show();
    try {
      await this.timKiem()
      await this.search();
      await this.spinner.hide();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
      lastest: 0,
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
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
