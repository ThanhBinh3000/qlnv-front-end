import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import dayjs from "dayjs";
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { QdPdKetQuaBttService } from 'src/app/services/qlnv-hang/xuat-hang/ban-truc-tiep/to-chu-trien-khai-btt/qd-pd-ket-qua-btt.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
@Component({
  selector: 'app-qd-pd-ket-qua-btt',
  templateUrl: './qd-pd-ket-qua-btt.component.html',
  styleUrls: ['./qd-pd-ket-qua-btt.component.scss']
})
export class QdPdKetQuaBttComponent extends Base2Component implements OnInit {
  @Input()
  loaiVthh: string;

  dsDonvi: any[] = [];
  userdetail: any = {};
  constructor(
    private httpClient: HttpClient,
    private donviService: DonviService,
    private storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private qdPdKetQuaBttService: QdPdKetQuaBttService
  ) {
    super(httpClient, storageService, notification, spinner, modal, qdPdKetQuaBttService);
    super.ngOnInit();
    this.formData = this.fb.group({
      namKh: [''],
      loaiVthh: [''],
      trichYeu: [''],
      ngayKy: [],
      maDvi: [''],
      tenDvi: [],
    });
    this.filterTable = {
      soQdKq: '',
      ngayKy: '',
      maDvi: '',
      tenDvi: '',
      soQdPd: '',
      loaiVthh: '',
      tenLoaiVthh: '',
      cloaiVthh: '',
      tenCloaiVthh: '',
      trangThai: '',
      tenTrangThai: '',

    };
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        maDvi: this.userService.isCuc() ? this.userInfo.MA_DVI : null,
      })
      await this.search();
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
      this.dsDonvi = dsTong.data;
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
    await this.loadDsTong();
  }

}
