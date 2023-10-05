import { Component, Input, OnInit } from '@angular/core';
import { Base2Component } from "src/app/components/base2/base2.component";
import { HttpClient } from "@angular/common/http";
import { StorageService } from "src/app/services/storage.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { NgxSpinnerService } from "ngx-spinner";
import { NzModalService } from "ng-zorro-antd/modal";
import { DonviService } from "src/app/services/donvi.service";
import { MESSAGE } from "src/app/constants/message";
import dayjs from "dayjs";
import { chain, cloneDeep } from 'lodash';
import * as uuid from "uuid";
import { CHUC_NANG, STATUS } from "src/app/constants/status";

@Component({
  selector: 'app-phieu-kiem-nghiem-chat-luong',
  templateUrl: './phieu-kiem-nghiem-chat-luong.component.html',
  styleUrls: ['./phieu-kiem-nghiem-chat-luong.component.scss']
})
export class PhieuKiemNghiemChatLuongComponent extends Base2Component implements OnInit {
  @Input() loaiXuat: any;
  @Input() loaiVthh: any;
  @Input() inputService: any;
  @Input() inputServiceGnv: any;
  @Input() inputServiceBbLayMau: any;
  @Input() maQuyen: MA_QUYEN_PKNCL = { THEM: '', XOA: '', XEM: '', DUYET_TP: '', DUYET_LDC: '', IN: '', EXPORT: '' };
  inputData: any;
  expandSetString = new Set<string>();
  isView: any = false;
  // public vldTrangThai: CuuTroVienTroComponent;
  // CHUC_NANG = CHUC_NANG;
  idQdGnv: any;
  showQdGnv: boolean = false;
  tableDataView: any = [];
  CHUC_NANG = CHUC_NANG;
  constructor(
    httpClient: HttpClient,
    storageService: StorageService,
    notification: NzNotificationService,
    spinner: NgxSpinnerService,
    modal: NzModalService,
    private donviService: DonviService,
  ) {
    super(httpClient, storageService, notification, spinner, modal, null);
    // this.vldTrangThai = this.cuuTroVienTroComponent;
    this.formData = this.fb.group({
      nam: null,
      soBbQd: null,
      soQdGiaoNvXh: null,
      soBbLayMau: null,
      dviKiemNghiem: null,
      tenDvi: null,
      maDvi: null,
      ngayKiemNghiem: null,
      ngayKiemNghiemTu: null,
      ngayKiemNghiemDen: null,
      type: null,
      loaiVthh: null,
    })
  }

  async ngOnInit() {
    try {
      this.formData.patchValue({
        loaiVthh: this.loaiVthh,
        type: this.loaiXuat
      });
      super.service = this.inputService;
      await this.search();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async search() {
    try {
      await this.spinner.show();
      if (this.formData.value.ngayKiemNghiem) {
        this.formData.value.ngayKiemNghiemTu = dayjs(this.formData.value.ngayKiemNghiem[0]).format('YYYY-MM-DD')
        this.formData.value.ngayKiemNghiemDen = dayjs(this.formData.value.ngayKiemNghiem[1]).format('YYYY-MM-DD')
      }
      await super.search();
      /* this.dataTable =
         [{
           "id": 3,
           "nam": 87,
           "maDvi": "test_2d8aa73baa6a",
           "soBbQd": "test_8cc9845509f2",
           "maDiaDiem": "test_f8380c9a6b48",
           "loaiVthh": "test_6e6e64bacc77",
           "cloaiVthh": "test_1bba071114dc",
           "tenVthh": "test_db17006f7b1e",
           "lyDoTuChoi": "test_191a33675b49",
           "trangThai": "test_b3397886c04a",
           "nguoiKyQdId": 37,
           "ngayKyQd": "2018-02-23",
           "ngayGduyet": "2016-07-11",
           "nguoiGduyetId": 9,
           "ngayPduyet": "2021-03-16",
           "ngayKyQdGnv": "2021-03-16",
           "nguoiPduyetId": 3,
           "tenLoaiVthh": "test_e1783d4e26eb",
           "tenCloaiVthh": "test_33f017be4150",
           "tenTrangThai": "test_50f4accb136b",
           "tenDvi": "test_76d0d4ed82f0",
           "tenCuc": "test_d1d512043099",
           "tenChiCuc": "test_194a5be6abf4",
           "tenDiemKho": "test_411e72b9e000",
           "tenNhaKho": "test_5239b68f9e34",
           "tenNganKho": "test_78a29ca9f48b",
           "tenLoKho": "test_9ae10cf3e176",
           "maQhns": "test_58f31caa70ef",
           "idQdGnv": 1041,
           "soQdGnv": "20/2023-QĐGNVCT",
           "idHopDong": 19,
           "soHopDong": "test_3797cd675968",
           "idBangKe": 21,
           "soBangKe": "test_fba39445233a",
           "ngayKy": "2023-06-10",
           "ktvBaoQuan": "test_90a55e416cb2",
           "dviKiemNghiem": "test_745e406321fc",
           "diaDiemLayMau": "test_d7d5462c5a8f",
           "soLuongMau": 35,
           "niemPhong": "test_8e655e5bc586",
           "loaiBb": "test_b0a20feadc44",
           "type": "test_4df9fef749e9",
           "fileDinhKem": [
             {
               "id": 88,
               "fileName": "test_cb344ab0ea37",
               "fileSize": "test_fb44dad87a0d",
               "fileUrl": "test_1ec53e6b3d4d",
               "fileType": "test_5d7acc7eb5e8",
               "dataType": "test_b9b2085cc3fe",
               "noiDung": "test_af2d7c93d111",
               "createDate": "2029-04-24 14:13:23"
             }
           ],
           "canCu": [
             {
               "id": 91,
               "fileName": "test_d18511bda1b0",
               "fileSize": "test_584bd5ea8da9",
               "fileUrl": "test_913efd289f3e",
               "fileType": "test_daae7fea10b4",
               "dataType": "test_7b12cce570c0",
               "noiDung": "test_c5dfba073ec5",
               "createDate": "2029-10-15 09:34:19"
             }
           ],
           "anhChupMauNiemPhong": [
             {
               "id": 14,
               "fileName": "test_a6500d780aba",
               "fileSize": "test_14877dd6d64f",
               "fileUrl": "test_dcd1c37ab3a1",
               "fileType": "test_895fc05cad27",
               "dataType": "test_61e44698e01d",
               "noiDung": "test_1dccd77f4282",
               "createDate": "2025-07-21 15:05:57"
             }
           ],
           "xhBienBanLayMauDtl": [
             {
               "id": 79,
               "ten": "test_ed38a482c11a",
               "loai": "test_81610a418a55",
               "soLuong": 10,
               "ghiChu": "test_14a4c6bc9fb9",
               "trangThai": "test_0d155cd1ad73",
               "type": "test_80ddce7e26a9",
               "ngayTao": "2017-03-11 18:53:27",
               "nguoiTaoId": 64,
               "ngaySua": "2024-04-26 22:15:07",
               "nguoiSuaId": 14
             }
           ],
           "ngayTao": "2023-11-12 06:43:53",
           "nguoiTaoId": 15,
           "ngaySua": "2031-03-18 12:55:23",
           "nguoiSuaId": 26
         },
           {
             "id": 99,
             "nam": 31,
             "maDvi": "test_0e3f3a3f9f2a",
             "soBbQd": "test_269206a02d60",
             "maDiaDiem": "test_5b4e54a75fcd",
             "loaiVthh": "test_048986fe719f",
             "cloaiVthh": "test_ae68b5089a66",
             "tenVthh": "test_3bc44d456862",
             "lyDoTuChoi": "test_302cf6e2dff6",
             "trangThai": "test_ca454d3239bc",
             "nguoiKyQdId": 61,
             "ngayKyQd": "2019-09-28",
             "ngayGduyet": "2015-01-11",
             "nguoiGduyetId": 98,
             "ngayPduyet": "2029-01-03",
             "ngayKyQdGnv": "2021-03-16",
             "nguoiPduyetId": 43,
             "tenLoaiVthh": "test_5597ddf3878f",
             "tenCloaiVthh": "test_999cd42ad4b0",
             "tenTrangThai": "test_efa2f606b50e",
             "tenDvi": "test_9e116d70eff3",
             "tenCuc": "test_bbbbd83d616c",
             "tenChiCuc": "test_2e49d737a84e",
             "tenDiemKho": "test_c8308fe7f2ca",
             "tenNhaKho": "test_96315b431970",
             "tenNganKho": "test_1ea9bcdafa61",
             "tenLoKho": "test_d3d239544b7a",
             "maQhns": "test_f0eb9ee59e09",
             "idQdGnv": 1041,
             "soQdGnv": "20/2023-QĐGNVCT",
             "idHopDong": 32,
             "soHopDong": "test_0d9087c0705b",
             "idBangKe": 27,
             "soBangKe": "test_e701d5e8dc96",
             "ngayKy": "2014-05-09",
             "ktvBaoQuan": "test_a04338bb2aff",
             "dviKiemNghiem": "test_52cec0fb2fae",
             "diaDiemLayMau": "test_736ece9aca4f",
             "soLuongMau": 47,
             "niemPhong": "test_339f793632a5",
             "loaiBb": "test_3c24bf1bec0e",
             "type": "test_673b3685baa2",
             "fileDinhKem": [
               {
                 "id": 53,
                 "fileName": "test_f377d72c150f",
                 "fileSize": "test_58dba56fdd5b",
                 "fileUrl": "test_1e31c0397728",
                 "fileType": "test_df707ac94539",
                 "dataType": "test_7581e142d3fe",
                 "noiDung": "test_a4a82bdbff3c",
                 "createDate": "2027-08-08 02:53:43"
               }
             ],
             "canCu": [
               {
                 "id": 88,
                 "fileName": "test_b9e150bf757e",
                 "fileSize": "test_4dce3cfb8843",
                 "fileUrl": "test_3707faad9d43",
                 "fileType": "test_a6aab828a135",
                 "dataType": "test_812f5675c878",
                 "noiDung": "test_dd971872bd4a",
                 "createDate": "2020-11-07 06:02:10"
               }
             ],
             "anhChupMauNiemPhong": [
               {
                 "id": 98,
                 "fileName": "test_2a3a6971ff98",
                 "fileSize": "test_035aff19b66d",
                 "fileUrl": "test_2664274189ae",
                 "fileType": "test_73f50c0f1e6a",
                 "dataType": "test_e40b0e489d4e",
                 "noiDung": "test_593efeaeee48",
                 "createDate": "2030-02-13 21:44:25"
               }
             ],
             "xhBienBanLayMauDtl": [
               {
                 "id": 70,
                 "ten": "test_1282d6667dd3",
                 "loai": "test_6174f606671a",
                 "soLuong": 86,
                 "ghiChu": "test_eda325f24ff6",
                 "trangThai": "test_f71c5f2cb8ee",
                 "type": "test_d2e8f199e628",
                 "ngayTao": "2025-10-05 18:58:36",
                 "nguoiTaoId": 62,
                 "ngaySua": "2027-08-03 22:20:11",
                 "nguoiSuaId": 7
               }
             ],
             "ngayTao": "2028-12-22 16:17:20",
             "nguoiTaoId": 7,
             "ngaySua": "2024-01-25 09:33:45",
             "nguoiSuaId": 38
           }];*/
      this.dataTable.forEach(s => s.idVirtual = uuid.v4());
      this.buildTableView();
    } catch (e) {
      console.log('error: ', e)
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  buildTableView() {
    this.tableDataView = chain(this.dataTable)
      .groupBy("soQdGnv")
      .map((value, key) => {
        let row = value.find(s => s.soQdGnv === key)
        this.expandSetString.add(row.idVirtual);
        return {
          idVirtual: row.idVirtual,
          soQdGnv: key,
          nam: row.nam,
          idQdGnv: row.idQdGnv,
          ngayKyQdGnv: row.ngayKyQdGnv,
          childData: value
        };
      }).value();
    this.expandAll()

  }


  expandAll() {
    this.dataTable.forEach(s => {
      this.expandSetString.add(s.idVirtual);
    });
  }

  onExpandStringChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSetString.add(id);
    } else {
      this.expandSetString.delete(id);
    }
  }


  redirectDetail(id, b: boolean, data?: any) {
    this.idSelected = id;
    this.isDetail = true;
    this.isView = b;
    this.inputData = data;
    // this.isViewDetail = isView ?? false;
  }

  openQdGnvModal(id: number) {
    this.idQdGnv = id;
    this.showQdGnv = true;
  }

  closeQdGnvModal() {
    this.idQdGnv = null;
    this.showQdGnv = false;
  }

  disabledStartNgayKiemNghiem = (startValue: Date): boolean => {
    if (startValue && this.formData.value.ngayKiemNghiemDen) {
      return startValue.getTime() > this.formData.value.ngayKiemNghiemDen.getTime();
    }
    return false;
  };

  disabledEndNgayKiemNghiem = (endValue: Date): boolean => {
    if (!endValue || !this.formData.value.ngayKiemNghiemTu) {
      return false;
    }
    return endValue.getTime() <= this.formData.value.ngayKiemNghiemDen.getTime();
  };

  checkStatusPermission(data: any, action: any) {
    let mapQuyen = {
      XEM: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH,
      ],
      SUA: [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDTC, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDC, STATUS.TU_CHOI_LDCC],
      XOA: [STATUS.DU_THAO],
      DUYET_LDTC: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDV: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT: [STATUS.CHO_DUYET_KT],
      TAO_QD: [STATUS.DA_DUYET_LDV],

      XEM_NO: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH,
      ],
      SUA_NO: [],
      XOA_NO: [],
      DUYET_LDTC_NO: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP_NO: [STATUS.CHO_DUYET_TP],
      DUYET_LDV_NO: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC_NO: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC_NO: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ_NO: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT_NO: [STATUS.CHO_DUYET_KT],
      TAO_QD_NO: []
    };
    let actionTmp = cloneDeep(action);
    if (data.maDvi !== this.userService.getUserLogin().MA_PHONG_BAN) {
      actionTmp = actionTmp + "_NO";
    }
    if (data) {
      return mapQuyen[actionTmp].includes(data.trangThai)
    } else {
      return false;
    }
  }
  checkRoleEdit(trangThai: STATUS): boolean {
    if (this.userService.isCuc() && [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDC].includes(trangThai) && this.userService.isAccessPermisson(this.maQuyen.THEM)) {
      return true
    }
    return false
  };
  checkRoleApprove(trangThai: STATUS): boolean {
    if (this.userService.isCuc() && (STATUS.CHO_DUYET_TP === trangThai && this.userService.isAccessPermisson(this.maQuyen.DUYET_TP) || STATUS.CHO_DUYET_LDC === trangThai && this.userService.isAccessPermisson(this.maQuyen.DUYET_LDC))) {
      return true
    }
    return false
  }
  checkRoleDelete(trangThai: STATUS): boolean {
    if (this.userService.isCuc() && ([STATUS.DU_THAO].includes(trangThai) && this.userService.isAccessPermisson(this.maQuyen.XOA))) {
      return true
    }
    return false
  };
  checkRoleView(trangThai: STATUS): boolean {
    if (!this.checkRoleEdit(trangThai) && !this.checkRoleApprove(trangThai) && !this.checkRoleDelete(trangThai) && this.userService.isAccessPermisson(this.maQuyen.XEM)) {
      return true
    }
    return false
  }
  checkRoleAdd(): boolean {
    if (this.userService.isCuc() && this.userService.isAccessPermisson(this.maQuyen.THEM)) {
      return true;
    }
    return false
  }
  checkRoleXoaDs(): boolean {
    if (this.userService.isCuc() && this.userService.isAccessPermisson(this.maQuyen.XOA)) {
      return true;
    }
    return false
  }
  checkRoleExport() {
    if (this.userService.isAccessPermisson(this.maQuyen.EXPORT)) {
      return true;
    }
    return false
  }
}
export interface MA_QUYEN_PKNCL {
  THEM: string;
  XOA: string;
  XEM: string;
  DUYET_TP: string;
  DUYET_LDC: string;
  IN: string;
  EXPORT: string
}