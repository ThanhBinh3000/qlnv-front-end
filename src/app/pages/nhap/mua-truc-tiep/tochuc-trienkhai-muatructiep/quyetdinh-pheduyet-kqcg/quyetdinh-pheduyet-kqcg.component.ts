import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { MESSAGE } from 'src/app/constants/message';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { StorageService } from 'src/app/services/storage.service';
import { DonviService } from 'src/app/services/donvi.service';
import { isEmpty } from 'lodash';
import { QuyetDinhPheDuyetKetQuaChaoGiaMTTService } from 'src/app/services/quyet-dinh-phe-duyet-ket-qua-chao-gia-mtt.service';
@Component({
  selector: 'app-quyetdinh-pheduyet-kqcg',
  templateUrl: './quyetdinh-pheduyet-kqcg.component.html',
  styleUrls: ['./quyetdinh-pheduyet-kqcg.component.scss']
})
export class QuyetdinhPheduyetKqcgComponent extends Base2Component implements OnInit {
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
    private quyetDinhPheDuyetKetQuaChaoGiaMTTService: QuyetDinhPheDuyetKetQuaChaoGiaMTTService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetKetQuaChaoGiaMTTService);
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
      soQd: '',
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
        loaiVthh: this.loaiVthh
      })
      await this.search();
      await this.initData();
      await this.checkPriceAdjust('xuất hàng');
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

  goDetail(id: number, roles?: any) {
    if ((id == null || id == 0) && this.checkPrice.boolean) {
      this.notification.error(MESSAGE.ERROR, this.checkPrice.msgSuccess);
      return;
    }
    if (!this.checkPermission(roles)) {
      return
    }
    this.idSelected = id;
    this.isDetail = true;
  }
}
