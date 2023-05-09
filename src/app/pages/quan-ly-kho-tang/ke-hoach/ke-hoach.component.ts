import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";
import { Router } from "@angular/router";
import { STATUS } from "../../../constants/status";
import { cloneDeep } from "lodash";

@Component({
  selector: 'app-ke-hoach',
  templateUrl: './ke-hoach.component.html',
  styleUrls: ['./ke-hoach.component.scss']
})
export class KeHoachComponent implements OnInit {

  isVisibleChangeTab$ = new Subject();
  visibleTab: boolean = true;
  constructor(
    public userService: UserService,
    public globals: Globals,
    private router : Router
  ) { }

  ngOnInit(): void {
    if (!this.userService.isAccessPermisson('QLKT_QHKHKT')) {
      this.router.navigateByUrl('/error/401')
    }
    this.isVisibleChangeTab$.subscribe((value: boolean) => {
      this.visibleTab = value;
    });
  }
  tabSelected = 'dmk';
  selectTab(tab) {
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
        STATUS.BAN_HANH, STATUS.DA_DUYET_CBV
      ],
      SUA: [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_CBV, STATUS.TU_CHOI_LDTC, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDC, STATUS.TU_CHOI_LDCC],
      XOA: [STATUS.DU_THAO],
      DUYET_LDTC: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDV: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      XEM_NO: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH, STATUS.DANG_THUC_HIEN
      ],
      SUA_NO: [],
      XOA_NO: [],
      DUYET_LDTC_NO: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP_NO: [STATUS.CHO_DUYET_TP],
      DUYET_LDV_NO: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC_NO: [STATUS.CHO_DUYET_LDC],
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
