import {Component, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {Globals} from "../../../../shared/globals";
import {STATUS} from "../../../../constants/status";
import {cloneDeep} from 'lodash';
@Component({
  selector: 'app-kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh',
  templateUrl: './kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh.component.html',
  styleUrls: ['./kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh.component.scss']
})
export class KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent implements OnInit {
  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  dataInit: any = {};
  isDetail: boolean;
  constructor(
    public userService: UserService,
    public globals: Globals
  ) {
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
      /* if (action == CHUC_NANG.XEM) {
         if (this.userService.isTongCuc()) {
           return mapQuyen[actionTmp].includes(data.trangThai) && !this.checkStatusPermission(data, CHUC_NANG.SUA);
         } else {
           return mapQuyen[actionTmp].includes(data.trangThai) && !this.checkStatusPermission(data, CHUC_NANG.SUA) && !this.checkStatusPermission(data, CHUC_NANG.DUYET_TP) && !this.checkStatusPermission(data, CHUC_NANG.DUYET_LDC) && !this.checkStatusPermission(data, CHUC_NANG.DUYET_LDCC);
         }

       } else {
         return mapQuyen[actionTmp].includes(data.trangThai)
       }*/
    } else {
      return false;
    }
  }

  taoQd($event: any) {
    this.selectTab(2);
    this.dataInit = $event;
    this.isDetail = true;
  }

  quayLai() {
    this.dataInit = {};
    this.isDetail = false;
  }
  receivedTab(tab) {
    if (tab >= 0) {
      this.tabSelected = tab;
    }
  }

}
