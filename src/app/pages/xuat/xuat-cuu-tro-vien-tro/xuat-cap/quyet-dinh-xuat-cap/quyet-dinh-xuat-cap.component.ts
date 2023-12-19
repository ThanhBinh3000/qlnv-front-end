import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "../../../../../services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DatePipe } from "@angular/common";
import { DonviService } from "../../../../../services/donvi.service";
import { UserLogin } from "../../../../../models/userlogin";
import { MESSAGE } from "../../../../../constants/message";
import dayjs from "dayjs";
import { Utils } from "../../../../../Utility/utils";
import { cloneDeep } from "lodash";
import { Base2Component } from "../../../../../components/base2/base2.component";
import {
  QuyetDinhXuatCapService
} from "../../../../../services/qlnv-hang/xuat-hang/xuat-cap/quyet-dinh-xuat-cap.service";
import { CHUC_NANG, STATUS } from "src/app/constants/status";
import { XuatCuuTroVienTroComponent } from "../../xuat-cuu-tro-vien-tro.component";
import {
  QuyetDinhPheDuyetPhuongAnCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhPheDuyetPhuongAnCuuTro.service";
import { LOAI_HANG_DTQG } from "src/app/constants/config";

@Component({
  selector: 'app-quyet-dinh-xuat-cap',
  templateUrl: './quyet-dinh-xuat-cap.component.html',
  styleUrls: ['./quyet-dinh-xuat-cap.component.scss']
})
export class QuyetDinhXuatCapComponent extends Base2Component implements OnInit {
  public vldTrangThai: XuatCuuTroVienTroComponent;
  public CHUC_NANG = CHUC_NANG;
  LOAI_HANG_DTQG = LOAI_HANG_DTQG;
  openQdPd = false;
  idQdPd = null;
  constructor(httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private datePipe: DatePipe,
    private donviService: DonviService,
    private quyetDinhPheDuyetPhuongAnCuuTroService: QuyetDinhPheDuyetPhuongAnCuuTroService,
    private xuatCuuTroVienTroComponent: XuatCuuTroVienTroComponent) {
    super(httpClient, storageService, notification, spinner, modal, quyetDinhPheDuyetPhuongAnCuuTroService);
    this.vldTrangThai = xuatCuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: null,
      soQdXc: null,
      ngayHieuLuc: null,
      ngayXuatCtvt: null,
      ngayXuatCtvtTu: null,
      ngayHieuLucTu: null,
      ngayHieuLucDen: null,
      ngayXuatCtvtDen: null,
      type: 'XC'
    });
    this.filterTable = {
      soQdXc: "",
      ngayHieuLucQdXc: "",
      soQdChuyenXc: "",
      ngayHieuLucQdChuyenXc: "",
      soLuongGaoXc: "",
      soLuongThocXc: "",
      trichYeu: "",
      tenTrangThai: ""
    };
  }

  userInfo: UserLogin;
  userdetail: any = {};

  isVatTu: boolean = false;
  isView = false;

  async ngOnInit() {
    try {
      this.initData();
      await this.timKiem();
      await this.spinner.hide();
    } catch (e) {
      console.log("error: ", e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async initData() {
    this.userInfo = this.userService.getUserLogin();
    this.userdetail.maDvi = this.userInfo.MA_DVI;
    this.userdetail.tenDvi = this.userInfo.TEN_DVI;
  }

  async timKiem() {
    await this.search();
  }

  redirectDetail(id, b: boolean) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
  }

  filterDateInTable(key: string, value: string) {
    if (value && value != "") {
      this.dataTable = [];
      let temp = [];
      if (this.dataTableAll && this.dataTableAll.length > 0) {
        value = this.datePipe.transform(value, Utils.FORMAT_DATE_STR);
        this.dataTableAll.forEach((item) => {
          if (item[key] && item[key].toString().toLowerCase().indexOf(value.toString().toLowerCase()) != -1) {
            temp.push(item);
          }
        });
      }
      this.dataTable = [...this.dataTable, ...temp];
    } else {
      this.dataTable = cloneDeep(this.dataTableAll);
    }
  };
  getSlGaoChuyenXuatCap(data: any): number {
    if (data.loaiVthh === LOAI_HANG_DTQG.GAO) {
      return data.soLuongXuatCap
    }
    return null
  }
  openQdPdModal(id: number) {
    this.idQdPd = id;
    this.openQdPd = true;
  }
  closeQdPdModal() {
    this.openQdPd = false;
    this.idQdPd = null;
  }
  checkRoleView(trangThai: STATUS) {
    return !this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDXC_XEM');
  }
  checkRoleAdd() {
    return this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_QDXC_TAOQDXC")
  }
  checkRoleEdit(trangThai: STATUS) {
    return [STATUS.DU_THAO, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDTC].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_QDXC_TAOQDXC")
  }
  checkRoleApprove(trangThai: STATUS) {
    return [STATUS.CHO_DUYET_LDV].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_QDXC_DUYET_LDVU") || [STATUS.CHO_DUYET_LDTC].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_QDXC_DUYET_LDTC")
  }
  checkRoleDelete(trangThai: STATUS) {
    return [STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson("XHDTQG_XCTVTXC_XC_QDXC_XOA")
  }
}
