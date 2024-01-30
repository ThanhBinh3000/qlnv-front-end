import {Component, OnInit} from '@angular/core';
import {Base2Component} from "../../../../../../../components/base2/base2.component";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../../../../../../services/storage.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NgxSpinnerService} from "ngx-spinner";
import {NzModalService} from "ng-zorro-antd/modal";
import {chain, cloneDeep} from 'lodash';
import * as uuid from "uuid";
import {UserLogin} from "../../../../../../../models/userlogin";
import {MESSAGE} from "../../../../../../../constants/message";
import dayjs from "dayjs";
import {CHUC_NANG} from "../../../../../../../constants/status";
import {
  BienBanLayMauVtKtclService
} from "../../../../../../../services/qlnv-hang/xuat-hang/xuatkhac/xuatvt/BienBanLayMauVtKtcl.service";

@Component({
  selector: 'app-xk-bien-ban-lay-mau-ban-giao-mau',
  templateUrl: './bien-ban-lay-mau-ban-giao-mau.component.html',
  styleUrls: ['./bien-ban-lay-mau-ban-giao-mau.component.scss']
})
export class XkBienBanLayMauBanGiaoMauComponent extends Base2Component implements OnInit {
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
      if (this.formData.value.ngayLayMau) {
        this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
        this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
      }
      await this.search();
      let data = cloneDeep(this.dataTable)
      this.dataTable = [];
      data.forEach(item => {
        if (item.maDiaDiem.startsWith(this.userInfo.MA_DVI)) {
          this.dataTable.push(item);
        }
      });
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
          .groupBy("tenDiemKho")
          .map((v, k) => {
              // let bb = v.find(s => s.tenDiemKho === k)
              return {
                idVirtual: uuid.v4(),
                tenDiemKho: k != "null" ? k : '',
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
