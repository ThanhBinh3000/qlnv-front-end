import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from 'src/app/services/user.service';
import {Globals} from 'src/app/shared/globals';
import {CHUC_NANG, STATUS} from "../../../../constants/status";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-cuu-tro-vien-tro',
  templateUrl: './cuu-tro-vien-tro.component.html',
  styleUrls: ['./cuu-tro-vien-tro.component.scss'],
})
export class CuuTroVienTroComponent implements OnInit {
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
      XEM: [STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.DA_TAO_CBV,STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
      ],
      SUA: [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDC, STATUS.TU_CHOI_LDCC],
      XOA: [STATUS.DU_THAO],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDV: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT: [STATUS.CHO_DUYET_KT],
      TAO_QD: [STATUS.DA_DUYET_LDV],

      XEM_NO: [STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
      ],
      SUA_NO: [],
      XOA_NO: [],
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
}
