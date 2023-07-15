import { Component, OnInit } from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {
  BienBanLayMauVtKtclService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BienBanLayMauVtKtcl.service";
import {UserLogin} from "../../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../../constants/message";
import dayjs from "dayjs";
import {CHUC_NANG} from "../../../../../../../constants/status";

@Component({
  selector: 'app-xk-vt-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class XkVtPhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauVtKtclService: BienBanLayMauVtKtclService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauVtKtclService);
    this.formData = this.fb.group({
      tenDvi: [],
      maDvi: [],
      nam: [],
      dviKiemDinh: [],
      soQdGiaoNvXh: [],
      soBienBan: [],
      ngayXuatKho: [],
      ngayLayMauTu: [],
      ngayLayMauDen: [],
    })
  }

  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  soQdGiaoNvXhSelected: string;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();
  idPhieuKnCl: number = 0;
  openPhieuKnCl = false;

  disabledStartNgayLayMau = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayLayMauDen) {
      return startValue.getTime() >= this.formData.value.ngayLayMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayLayMau = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayLayMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayLayMauTu.getTime();
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
    this.buildTableView();
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }


  isOwner(maDvi: any) {
    return this.userInfo.MA_PHONG_BAN == maDvi;
  }

  isBelong(maDvi: any) {
    return this.userInfo.MA_DVI == maDvi;
  }

  async timKiem() {
    await this.spinner.show();
    try {
      if (this.formData.value.ngayXuatKho) {
        this.formData.value.ngayXuatKhoTu = dayjs(this.formData.value.ngayXuatKho[0]).format('YYYY-MM-DD')
        this.formData.value.ngayXuatKhoDen = dayjs(this.formData.value.ngayXuatKho[1]).format('YYYY-MM-DD')
      }
      await this.search();
    } catch (e) {
      console.log(e)
    }
    await this.spinner.hide();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("tenDiemKho")
      .map((value, key) => {
        let bb = value.find(f => f.tenDiemKho === key)
        let nam = bb ? bb.nam : null;
        let soQd = bb ? bb.soQdGiaoNvXh : null;
        let ngayXuatHangLayMau = bb ? bb.ngayXuatLayMau : null;
        return {
          idVirtual: uuid.v4(),
          tenDiemKho: key != "null" ? key : '',
          nam: nam,
          soQdGiaoNvXh: soQd,
          childData: value,
          ngayXuatLayMau: ngayXuatHangLayMau
        };
      }).value();
    this.children = dataView
    console.log(this.children, 'childrenchildrenchildren');
    this.expandAll()
  }

  expandAll() {
    this.children.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    })
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean, soQdGiaoNvXh?) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    this.soQdGiaoNvXhSelected = soQdGiaoNvXh;
    // this.isViewDetail = isView ?? false;
  }

  openPhieuKnClModal(id: number) {
    this.idPhieuKnCl = id;
    this.openPhieuKnCl = true;
  }

  closePhieuKnClModal() {
    this.idPhieuKnCl = null;
    this.openPhieuKnCl = false;
  }

  async showList() {
    this.isDetail = false;
    await this.search();
  }
}
