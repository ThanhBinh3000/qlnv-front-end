import {Component, Input, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzModalService} from "ng-zorro-antd/modal";
import {Base2Component} from 'src/app/components/base2/base2.component';
import {HttpClient} from '@angular/common/http';
import {StorageService} from 'src/app/services/storage.service';
import {MESSAGE} from 'src/app/constants/message';
import {
  ChaoGiaMuaLeUyQuyenService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/chao-gia-mua-le-uy-quyen.service';
import {isEmpty} from 'lodash';
import {DonviService} from 'src/app/services/donvi.service';
import {XuatTrucTiepComponent} from "../../xuat-truc-tiep.component";
import {CHUC_NANG} from "../../../../../constants/status";

@Component({
  selector: 'app-thong-tin-ban-truc-tiep',
  templateUrl: './thong-tin-ban-truc-tiep.component.html',
  styleUrls: ['./thong-tin-ban-truc-tiep.component.scss']
})
export class ThongTinBanTrucTiepComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  CHUC_NANG = CHUC_NANG;
  public vldTrangThai: XuatTrucTiepComponent
  dsDonvi: any[] = [];
  userdetail: any = {};
  isView: boolean = false;
  idQdPdKh: number = 0;
  isViewQdPdKh: boolean = false;
  idQdPdKq: number = 0;
  isViewQdPdKq: boolean = false;
  listTrangThai: any[] = [
    {ma: this.STATUS.CHUA_CAP_NHAT, giaTri: 'Chưa cập nhật'},
    {ma: this.STATUS.DANG_CAP_NHAT, giaTri: 'Đang cập nhật'},
    {ma: this.STATUS.HOAN_THANH_CAP_NHAT, giaTri: 'Hoàn thành cập nhật'},
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private chaoGiaMuaLeUyQuyenService: ChaoGiaMuaLeUyQuyenService,
    private xuatTrucTiepComponent: XuatTrucTiepComponent,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaoGiaMuaLeUyQuyenService);
    this.vldTrangThai = this.xuatTrucTiepComponent;
    this.formData = this.fb.group({
      namKh: null,
      ngayCgiaTu: null,
      ngayCgiaDen: null,
      tochucCanhan: null,
      maChiCuc: null,
      loaiVthh: null,
    })

    this.filterTable = {
      soQdPd: '',
      pthucBanTrucTiep: '',
      ngayNhanCgia: '',
      soQdKq: '',
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
        this.initData()
      ]);
    } catch (e) {
      console.log('error: ', e);
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (isEmpty(dsTong)) return;
    this.dsDonvi = dsTong.data;
  }

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  async clearFilter() {
    this.formData.reset();
    await this.timKiem();
    await this.search();
  }

  redirectDetail(id, isView: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView;
  }

  openModal(id: number, modalType: string) {
    switch (modalType) {
      case 'QdPdKh':
        this.idQdPdKh = id;
        this.isViewQdPdKh = true;
        break;
      case 'QdPdKq':
        this.idQdPdKq = id;
        this.isViewQdPdKq = true;
        break;
      default:
        break;
    }
  }

  closeModal(modalType: string) {
    switch (modalType) {
      case 'QdPdKh':
        this.idQdPdKh = null;
        this.isViewQdPdKh = false;
        break;
      case 'QdPdKq':
        this.idQdPdKq = null;
        this.isViewQdPdKq = false;
        break;
      default:
        break;
    }
  }

  disabledNgayChaoGiaTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayCgiaDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayCgiaDen.getTime();
  };

  disabledNgayChaoGiaDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayCgiaTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayCgiaTu.getTime();
  };
}
