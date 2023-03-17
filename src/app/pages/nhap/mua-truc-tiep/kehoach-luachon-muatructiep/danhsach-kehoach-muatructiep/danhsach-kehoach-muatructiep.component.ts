import { Component, Input, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { DanhSachMuaTrucTiepService } from 'src/app/services/danh-sach-mua-truc-tiep.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-danhsach-kehoach-muatructiep',
  templateUrl: './danhsach-kehoach-muatructiep.component.html',
  styleUrls: ['./danhsach-kehoach-muatructiep.component.scss']
})
export class DanhsachKehoachMuatructiepComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  dsDonvi: any[] = [];
  userdetail: any = {};
  listTrangThaiTh: any[] = [];
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private danhSachMuaTrucTiepService: DanhSachMuaTrucTiepService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, danhSachMuaTrucTiepService);
    this.formData = this.fb.group({
      namKh: [],
      maDvi: [],
      tenDvi: [],
      soDxuat: [],
      ngayTao: [],
      ngayPduyet: [],
      trichYeu: [],
      noiDungThop: [],
      trangThaiTh: [],
    });

    this.filterTable = {
      soDxuat: '',
      namKh: '',
      ngayTao: '',
      ngayPduyet: '',
      trichYeu: '',
      soQd: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      tongSoLuong: '',
      soQdPduyet: '',
      tenTrangThai: '',
      tenTrangThaiTh: '',
    };
  }

  listChiCuc: any[] = [];

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await Promise.all([
        this.loadDataComboBox(),
        this.timKiem(),
        this.initData()
      ]);
      await this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async timKiem() {
    if (this.formData.value.ngayTao) {
      this.formData.value.ngayTaoTu = dayjs(this.formData.value.ngayTao[0]).format('YYYY-MM-DD')
      this.formData.value.ngayTaoDen = dayjs(this.formData.value.ngayTao[1]).format('YYYY-MM-DD')
    }
    if (this.formData.value.ngayPduyet) {
      this.formData.value.ngayDuyetTu = dayjs(this.formData.value.ngayPduyet[0]).format('YYYY-MM-DD')
      this.formData.value.ngayDuyetDen = dayjs(this.formData.value.ngayPduyet[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data;
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

  async loadDataComboBox() {
    this.listTrangThaiTh = [
      {
        ma: '24',
        giaTri: 'Chưa Tổng Hợp',
      },
      {
        ma: '25',
        giaTri: 'Đã Tổng Hợp',
      },
      {
        ma: '26',
        giaTri: 'Chưa Tạo QĐ',
      },
      {
        ma: '27',
        giaTri: 'Đã Dự Thảo QĐ',
      },
      {
        ma: '28',
        giaTri: 'Đã Ban Hành QĐ ',
      },
    ];
  }
}
