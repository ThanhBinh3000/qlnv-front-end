import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";

import dayjs from "dayjs";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {StorageService} from "../../../../../../services/storage.service";
import {CHUC_NANG, STATUS} from "../../../../../../constants/status";
import {UserLogin} from "../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../constants/message";
import {
  BaoCaoKdmVtTbTrongThoiGianBaoHanh
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BaoCaoKdmVtTbTrongThoiGianBaoHanh.service";

@Component({
  selector: 'app-bao-cao-ket-qua-kiem-dinh-vt-tb',
  templateUrl: './bao-cao-ket-qua-kiem-dinh-vt-tb.component.html',
  styleUrls: ['./bao-cao-ket-qua-kiem-dinh-vt-tb.component.scss']
})
export class BaoCaoKetQuaKiemDinhVtTbComponent extends Base2Component implements OnInit {

  CHUC_NANG = CHUC_NANG;
  STATUS = STATUS;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private baoCaoKdmVtTbTrongThoiGianBaoHanh: BaoCaoKdmVtTbTrongThoiGianBaoHanh,
  ) {
    super(httpClient, storageService, notification, spinner, modal, baoCaoKdmVtTbTrongThoiGianBaoHanh);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      tenBaoCao: [],
      soQdGiaoNvXh: [],
      ngayBaoCaoTu: [],
      ngayBaoCaoDen: [],
    })
  }

  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;
  @Output() tabFocus = new EventEmitter<object>();
  disabledStartNgayBaoCao = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayBaoCaoDen) {
      return startValue.getTime() >= this.formData.value.ngayBaoCaoDen.getTime();
    }
    return false;
  };

  disabledEndNgayBaoCao = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayBaoCaoTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayBaoCaoTu.getTime();
  };

  ngOnInit(): void {
    try {
      this.initData()
      this.timKiem();
    } catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search(roles?): Promise<void> {
    await super.search(roles);
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayBaoCao) {
        this.formData.value.ngayBaoCaoTu = dayjs(this.formData.value.ngayBaoCao[0]).format('YYYY-MM-DD')
        this.formData.value.ngayBaoCaoDen = dayjs(this.formData.value.ngayBaoCao[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }

}
