import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";
import { STATUS } from "../../../constants/status";
import { cloneDeep } from 'lodash';

@Component({
  selector: "app-xuat-cuu-tro-vien-tro",
  templateUrl: "./xuat-cuu-tro-vien-tro.component.html",
  styleUrls: ["./xuat-cuu-tro-vien-tro.component.scss"]
})
export class XuatCuuTroVienTroComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  defaultTabCtvt: any = 0;
  defaultTabXc: any = 0;

  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
    if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XDPA')) {
      this.defaultTabCtvt = 0;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_THPA')) {
      this.defaultTabCtvt = 1;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDPDPA')) {
      this.defaultTabCtvt = 2;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_QDGNVXH')) {
      this.defaultTabCtvt = 3;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_KTCL')) {
      this.defaultTabCtvt = 4;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_CTVT_XK')) {
      this.defaultTabCtvt = 5;
    } else {
      this.defaultTabCtvt = null;
    }


    // if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDPACHUYENXC') && userService.isTongCuc()) {
    //   this.defaultTabXc = 0;
    // } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDXC')) {
    //   this.defaultTabXc = 1;
    // } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDGNVXH')) {
    //   this.defaultTabXc = 2;
    // } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_KTCL')) {
    //   this.defaultTabXc = 3;
    // } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_XK')) {
    //   this.defaultTabXc = 4;
    // }
    if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDXC')) {
      this.defaultTabXc = 1;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_QDGNVXH')) {
      this.defaultTabXc = 2;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_KTCL')) {
      this.defaultTabXc = 3;
    } else if (this.userService.isAccessPermisson('XHDTQG_XCTVTXC_XC_XK')) {
      this.defaultTabXc = 4;
    } else {
      this.defaultTabXc = null
    }
  }

  ngOnInit(): void {
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }

  checkStatusPermission(data: any, action: any) {
    let mapQuyen = {
      XEM: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH
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
        STATUS.BAN_HANH
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
    }
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
}
