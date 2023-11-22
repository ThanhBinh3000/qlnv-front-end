import { Component, OnInit, Input } from '@angular/core';
import { Base2Component } from 'src/app/components/base2/base2.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzModalService } from 'ng-zorro-antd/modal';
import dayjs from 'dayjs';
import { UserLogin } from 'src/app/models/userlogin';
import { MESSAGE } from 'src/app/constants/message';
import { chain } from 'lodash';
import * as uuid from "uuid";
import { XuatCuuTroVienTroComponent } from "../../../xuat-cuu-tro-vien-tro.component";
import { CHUC_NANG, STATUS } from "../../../../../../constants/status";
import {
  PhieuKiemTraChatLuongService
} from "../../../../../../services/qlnv-hang/xuat-hang/xuat-cap/PhieuKiemTraChatLuong.service";

@Component({
  selector: 'app-phieu-kiem-tra-chat-luong',
  templateUrl: './phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-tra-chat-luong.component.scss']
})
export class PhieuKiemTraChatLuongComponent extends Base2Component implements OnInit {

  @Input()
  loaiVthh: string;
  @Input()
  loaiVthhCache: string;

  public vldTrangThai: XuatCuuTroVienTroComponent;
  public CHUC_NANG = CHUC_NANG;
  idQdGnv: number = 0;
  openQdGnv = false;
  idBbTk: number = 0;
  openBbTk = false;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private phieuKiemTraChatLuongService: PhieuKiemTraChatLuongService,
    private xuatCuuTroVienTroComponent: XuatCuuTroVienTroComponent
  ) {
    super(httpClient, storageService, notification, spinner, modal, phieuKiemTraChatLuongService);
    this.vldTrangThai = xuatCuuTroVienTroComponent;
    this.formData = this.fb.group({
      tenDvi: null,
      maDvi: null,
      nam: null,
      soQdGiaoNvXh: null,
      soPhieuKtCl: null,
      soBienBan: null,
      ngayKnMau: null,
      ngayKnMauTu: null,
      ngayKnMauDen: null,
      soBbXuatDocKho: null,
      loaiVthh: null,
      type: null
    })
    this.filterTable = {
      soQdGiaoNvXh: '',
      nam: '',
      thoiHanXuatCtVt: '',
      soPhieuKtCl: '',
      ngayKnMau: '',
      tenDiemKho: '',
      tenNhaKho: '',
      tenNganKho: '',
      tenLoKho: '',
      soBienBan: '',
      ngayLayMau: '',
      soBbTinhKho: '',
      ngayXuatDocKho: '',
      tenTrangThai: '',
    };
  }


  userInfo: UserLogin;
  userdetail: any = {};
  selectedId: number = 0;
  isVatTu: boolean = false;
  isView = false;
  children: any = [];
  expandSetString = new Set<string>();

  disabledStartNgayKn = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKnMauDen) {
      return startValue.getTime() >= this.formData.value.ngayKnMauDen.getTime();
    }
    return false;
  };

  disabledEndNgayKn = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKnMauTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKnMauTu.getTime();
  };

  ngOnInit(): void {
    try {
      console.log(this.loaiVthh, "2222")
      this.initData()
      this.timKiem();
    }
    catch (e) {
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
    if (this.formData.value.ngayLayMau) {
      this.formData.value.ngayLayMauTu = dayjs(this.formData.value.ngayLayMau[0]).format('YYYY-MM-DD')
      this.formData.value.ngayLayMauDen = dayjs(this.formData.value.ngayLayMau[1]).format('YYYY-MM-DD')
    }
    this.formData.patchValue({
      loaiVthh: this.loaiVthh
    })
    await this.search();
    this.dataTable.forEach(s => s.idVirtual = uuid.v4());
    this.buildTableView();
  }

  buildTableView() {
    let dataView = chain(this.dataTable)
      .groupBy("soQdGiaoNvXh")
      .map((value, key) => {
        let quyetDinh = value.find(f => f.soQdGiaoNvXh === key)
        let nam = quyetDinh.nam;
        let thoiHanXuatCtVt = quyetDinh.thoiHanXuatCtVt;
        return {
          idVirtual: uuid.v4(),
          soQdGiaoNvXh: key != "null" ? key : '',
          nam: nam,
          thoiHanXuatCtVt: thoiHanXuatCtVt,
          childData: value
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


  redirectDetail(id, b: boolean) {
    this.selectedId = id;
    this.isDetail = true;
    this.isView = b;
    // this.isViewDetail = isView ?? false;
  }
  openQdGnvModal(id: any) {
    this.idQdGnv = id;
    this.openQdGnv = true;
  }

  closeQdGnvModal() {
    this.idQdGnv = null;
    this.openQdGnv = false;
  }

  openSoBbTkModal(id: any) {
    this.idBbTk = id;
    this.openBbTk = true;
  }

  closeSoBbTkModal() {
    this.idBbTk = null;
    this.openBbTk = false;
  }
  checkRoleView(trangThai: STATUS): boolean {
    if (!this.checkRoleEdit(trangThai) && !this.checkRoleApprop(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_KTCL_LT_BBLMBGM_XEM")) {
      return true;
    }
    return false;
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if ([STATUS.DU_THAO, STATUS.TU_CHOI_LDCC].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_KTCL_LT_BBLMBGM_THEM") && this.userService.isChiCuc()) {
      return true;
    }
    return false;
  }
  checkRoleApprop(trangThai: STATUS): boolean {
    if ([STATUS.CHO_DUYET_LDCC].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_KTCL_LT_BBLMBGM_DUYET_LDCCUC") && this.userService.isChiCuc()) {
      return true;
    }
    return false;
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    if ([STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_KTCL_LT_BBLMBGM_XOA") && this.userService.isChiCuc()) {
      return true
    }
    return false
  }
}
