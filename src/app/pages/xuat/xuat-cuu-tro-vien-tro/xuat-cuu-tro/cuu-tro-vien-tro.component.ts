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
      XEM: [STATUS.DU_THAO, STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC, STATUS.DA_DUYET_LDC],
      SUA: [STATUS.DU_THAO, STATUS.DA_TAO_CBV, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDC],
      XOA: [STATUS.DU_THAO],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      XEM_NO: [STATUS.DU_THAO, STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_TP, STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC],
      SUA_NO: [],
      XOA_NO: [],
      DUYET_TP_NO: [STATUS.CHO_DUYET_TP],
      DUYET_LDC_NO: [STATUS.CHO_DUYET_LDC]
    }
    let actionTmp = cloneDeep(action);
    if (data.maDvi !== this.userService.getUserLogin().MA_PHONG_BAN) {
      actionTmp = actionTmp + "_NO";
    }
    if (data) {
      if (action == CHUC_NANG.XEM) {
        return mapQuyen[actionTmp].includes(data.trangThai) && !this.checkStatusPermission(data, CHUC_NANG.SUA)
      } else if (action == CHUC_NANG.DUYET_TP || action == CHUC_NANG.DUYET_LDC) {
        return mapQuyen[actionTmp].includes(data.trangThai) && this.userService.isCuc()
      } else {
        return mapQuyen[actionTmp].includes(data.trangThai)
      }
    } else {
      return false;
    }
  }
}
