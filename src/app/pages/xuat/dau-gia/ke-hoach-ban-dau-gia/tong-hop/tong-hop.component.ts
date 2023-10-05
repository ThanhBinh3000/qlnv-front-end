import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  TongHopDeXuatKeHoachBanDauGiaService
} from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { LOAI_HANG_DTQG } from 'src/app/constants/config';
import { STATUS } from 'src/app/constants/status';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  @Input() listVthh: any[] = [];
  isView = false;
  listLoaiHangHoa: any[] = [];
  dataTongHop: any;
  isQuyetDinh: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;
  listTrangThai: any = [];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private danhMucService: DanhMucService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formData = this.fb.group({
      namKh: '',
      loaiVthh: '',
      noiDungThop: '',
      ngayThopTu: '',
      ngayThopDen: '',
    });
    this.filterTable = {
      id: '',
      ngayTao: '',
      noiDungThop: '',
      namKh: '',
      soQdPd: '',
      tenLoaiVthh: '',
      tenTrangThai: '',
    }
    this.listTrangThai = [
      {
        value: this.STATUS.CHUA_TAO_QD,
        text: 'Chưa Tạo QĐ'
      },
      {
        value: this.STATUS.DA_DU_THAO_QD,
        text: 'Đã Dự Thảo QĐ'
      },
      {
        value: this.STATUS.DA_BAN_HANH_QD,
        text: 'Đã Ban Hành QĐ'
      },
    ]
  }

  async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.timKiem(), this.search()]);
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

  async timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    });
    if (this.loaiVthh.startsWith(LOAI_HANG_DTQG.VAT_TU)) {
      await this.loadDsVthh();
    }
  }

  async clearFilter() {
    this.formData.reset();
    await Promise.all([this.timKiem(), this.search()]);
  }

  async loadDsVthh() {
    const res = await this.danhMucService.getDanhMucHangDvqlAsyn({});
    if (res.msg === MESSAGE.SUCCESS) {
      this.listLoaiHangHoa = res.data?.filter(x => x.ma.length === 4) || [];
    }
  }

  taoQdinh(data: number) {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.dataTongHop = data;
  }

  async showTongHop() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
    await this.search();
  }

  isInvalidDateRange = (startValue: Date, endValue: Date, formDataKey: string): boolean => {
    const startDate = this.formData.value[formDataKey + 'Tu'];
    const endDate = this.formData.value[formDataKey + 'Den'];
    return !!startValue && !!endValue && startValue.getTime() > endValue.getTime();
  };

  disabledNgayThopTu = (startValue: Date): boolean => {
    return this.isInvalidDateRange(startValue, this.formData.value.ngayThopDen, 'ngayThop');
  };

  disabledNgayThopDen = (endValue: Date): boolean => {
    return this.isInvalidDateRange(endValue, this.formData.value.ngayThopTu, 'ngayThop');
  };

  openModalQdPd(id: number) {
    this.updateQdPd(id, true);
  }

  closeModalQdPd() {
    this.updateQdPd(null, false);
  }

  private updateQdPd(id: number | null, isView: boolean) {
    this.idQdPd = id;
    this.isViewQdPd = isView;
  }

  isActionAllowed(data): boolean {
    return this.userService.isAccessPermisson('XHDTQG_PTDG_KHBDG_TONGHOP_XEM') &&
      (data.trangThai !== STATUS.CHUA_TAO_QD || !this.userService.isAccessPermisson('XHDTQG_PTDG_KHBDG_TONGHOP_TONGHOP'));
  }
}
