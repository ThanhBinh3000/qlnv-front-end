import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TongHopDeXuatKeHoachBanDauGiaService } from 'src/app/services/qlnv-hang/xuat-hang/ban-dau-gia/de-xuat-kh-bdg/tongHopDeXuatKeHoachBanDauGia.service';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent extends Base2Component implements OnInit {
  @Input() loaiVthh: string;
  isQuyetDinh: boolean = false;
  idQdPd: number = 0;
  isViewQdPd: boolean = false;

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_TAO_QD, giaTri: 'Chưa Tạo QĐ' },
    { ma: this.STATUS.DA_DU_THAO_QD, giaTri: 'Đã Dự Thảo QĐ' },
    { ma: this.STATUS.DA_BAN_HANH_QD, giaTri: 'Đã Ban Hành QĐ' },
  ];

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private tongHopDeXuatKeHoachBanDauGiaService: TongHopDeXuatKeHoachBanDauGiaService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, tongHopDeXuatKeHoachBanDauGiaService);
    this.formData = this.fb.group({
      namKh: '',
      ngayThopTu: '',
      ngayThopDen: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      noiDungThop: '',
      typeLoaiVthh: ''
    })
  }

  filterTable: any = {
    id: '',
    ngayTao: '',
    noiDungThop: '',
    namKh: '',
    soQdPd: '',
    tenLoaiVthh: '',
    tenTrangThai: '',
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.timKiem();
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  taoQdinh(id: number) {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[0];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[2];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = true;
    this.idSelected = id;
  }

  showTongHop() {
    let elem = document.getElementById('mainTongCuc');
    let tabActive = elem.getElementsByClassName('ant-menu-item')[2];
    tabActive.classList.remove('ant-menu-item-selected')
    let setActive = elem.getElementsByClassName('ant-menu-item')[0];
    setActive.classList.add('ant-menu-item-selected');
    this.isQuyetDinh = false;
    this.search;
  }

  timKiem() {
    this.formData.patchValue({
      loaiVthh: this.loaiVthh,
    })
  }

  clearFilter() {
    this.formData.reset();
    this.timKiem();
    this.search();
  }

  openModalQdPd(id: number) {
    this.idQdPd = id;
    this.isViewQdPd = true;
  }

  closeModalQdPd() {
    this.idQdPd = null;
    this.isViewQdPd = false;
  }

  disabledNgayThopTu = (startValue: Date): boolean => {
    if (!startValue || !this.formData.value.ngayThopDen) {
      return false;
    }
    return startValue.getTime() > this.formData.value.ngayThopDen.getTime();
  };

  disabledNgayThopDen = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayThopTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayThopTu.getTime();
  };

}
