import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NzModalService } from "ng-zorro-antd/modal";
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { MESSAGE } from 'src/app/constants/message';
import { isEmpty } from 'lodash';
import { DonviService } from 'src/app/services/donvi.service';
import { ChaogiaUyquyenMualeService } from 'src/app/services/chaogia-uyquyen-muale.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-chaogia-uyquyen-muale',
  templateUrl: './chaogia-uyquyen-muale.component.html',
  styleUrls: ['./chaogia-uyquyen-muale.component.scss']
})
export class ChaogiaUyquyenMualeComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;

  dsDonvi: any[] = [];
  userdetail: any = {};
  isView: any;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
    private chaogiaUyquyenMualeService: ChaogiaUyquyenMualeService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, chaogiaUyquyenMualeService);
    this.formData = this.fb.group({
      namKh: null,
      ngayNhanCgia: null,
      canhanTochuc: null,
      maDvi: null,
      tenDvi: null,
      loaiVthh: null,
      lastest: null
    })

    this.filterTable = {
      soQd: '',
      maDvi: '',
      tenDvi: '',
      namKh: '',
      pthucMuaTrucTiep: '',
      ngayNhanCgia: '',
      soQdKq: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      tenCloaiVthh: '',
      cloaiVthh: '',
      tenTrangThai: ''
    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        lastest: null,
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.timKiem();
      await this.initData()
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDsTong() {
    const dsTong = await this.donviService.layDonViCon();
    if (!isEmpty(dsTong)) {
      this.dsDonvi = dsTong.data.filter(x => x.type == 'DV');
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }


  async timKiem() {
    if (this.formData.value.ngayChaoGia) {
      this.formData.value.ngayCgiaTu = dayjs(this.formData.value.ngayTao[0]).format('YYYY-MM-DD')
      this.formData.value.ngayCgiadDen = dayjs(this.formData.value.ngayTao[1]).format('YYYY-MM-DD')
    }
    await this.search();
  }

  goDetail(id: number, isView?: any) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = isView
  }
}
