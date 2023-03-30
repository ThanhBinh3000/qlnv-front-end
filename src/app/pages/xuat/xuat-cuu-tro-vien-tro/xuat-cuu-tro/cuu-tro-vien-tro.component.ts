import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import {CHUC_NANG, STATUS} from "../../../../constants/status";
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
  ) { }

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
    if (data) {
      //owner
      if (data.maDvi === this.userService.getUserLogin().MA_PHONG_BAN) {
        if (action === CHUC_NANG.XEM) {
          if (data.trangThai === STATUS.DA_TAO_CBV ||
            data.trangThai === STATUS.CHO_DUYET_TP ||
            data.trangThai === STATUS.CHO_DUYET_LDC ||
            data.trangThai === STATUS.DA_DUYET_LDC) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.SUA) {
          if (data.trangThai === STATUS.DU_THAO ||
            data.trangThai === STATUS.DA_TAO_CBV ||
            data.trangThai === STATUS.TU_CHOI_TP ||
            data.trangThai === STATUS.TU_CHOI_LDC) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.DUYET_TP) {
          if (data.trangThai === STATUS.CHO_DUYET_TP) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.DUYET_LDC) {
          if (data.trangThai === STATUS.CHO_DUYET_LDC) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.XOA) {
          if (data.trangThai === STATUS.DU_THAO) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (action === CHUC_NANG.XEM) {
          if (data.trangThai === STATUS.DU_THAO ||
            data.trangThai === STATUS.DA_TAO_CBV ||
            data.trangThai === STATUS.TU_CHOI_TP ||
            data.trangThai === STATUS.TU_CHOI_LDC ||
            data.trangThai === STATUS.DA_DUYET_LDC) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.SUA) {
          return false;
        } else if (action === CHUC_NANG.DUYET_TP) {
          if (data.trangThai === STATUS.CHO_DUYET_TP) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.DUYET_LDC) {
          if (data.trangThai === STATUS.CHO_DUYET_LDC) {
            return true;
          } else {
            return false;
          }
        } else if (action === CHUC_NANG.XOA) {
          return false;
        }
      }
    } else {
      return false;
    }
  }
}
