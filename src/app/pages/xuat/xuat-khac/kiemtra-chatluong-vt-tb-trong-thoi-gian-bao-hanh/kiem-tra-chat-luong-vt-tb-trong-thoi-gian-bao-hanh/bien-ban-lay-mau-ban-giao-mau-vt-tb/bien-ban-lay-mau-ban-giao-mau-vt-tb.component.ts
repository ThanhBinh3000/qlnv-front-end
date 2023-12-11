import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";

import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain} from 'lodash';
import * as uuid from "uuid";
import {StorageService} from "../../../../../../services/storage.service";
import {Base2Component} from "../../../../../../components/base2/base2.component";
import {UserLogin} from "../../../../../../models/userlogin";
import {CHUC_NANG} from "../../../../../../constants/status";
import {MESSAGE} from "../../../../../../constants/message";
import dayjs from "dayjs";
import {
  BienBanLayMauVtTbTrongThoiGianBaoHanhService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvtbaohanh/BienBanLayMauVtTbTrongThoiGianBaoHanh.service";


@Component({
  selector: 'app-bien-ban-lay-mau-ban-giao-mau-vt-tb',
  templateUrl: './bien-ban-lay-mau-ban-giao-mau-vt-tb.component.html',
  styleUrls: ['./bien-ban-lay-mau-ban-giao-mau-vt-tb.component.scss']
})
export class XkBienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
  CHUC_NANG = CHUC_NANG;

  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private bienBanLayMauVtTbTrongThoiGianBaoHanhService: BienBanLayMauVtTbTrongThoiGianBaoHanhService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, bienBanLayMauVtTbTrongThoiGianBaoHanhService);
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
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let parent = value.find(f => f.soQdGiaoNvXh === key)
        let rs = chain(value)
          .groupBy("maDiaDiem")
          .map((v, k) => {
              let bb = v.find(s => s.maDiaDiem === k)
              return {
                idVirtual: uuid.v4(),
                maDiaDiem: k != "null" ? k : '',
                tenLoKho: bb.tenLoKho != "null" ? bb.tenLoKho : '',
                tenNganKho: bb.tenNganKho != "null" ? bb.tenNganKho : '',
                tenDiemKho: bb.tenDiemKho != "null" ? bb.tenDiemKho : '',
                tenCloaiVthh: bb.tenCloaiVthh != "null" ? bb.tenCloaiVthh : '',
                childData: v,
              };
            }
          ).value();
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: parent ? parent.nam : null,
          ngayXuatLayMau: parent ? parent.ngayXuatLayMau : null,
          childData: rs
        };
      }).value();
    this.children = dataView
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
