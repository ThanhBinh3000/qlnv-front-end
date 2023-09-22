import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { UserService } from "../../../services/user.service";
import { Globals } from "../../../shared/globals";
import { STATUS } from "../../../constants/status";
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-xuat-thanh-ly',
  templateUrl: './xuat-thanh-ly.component.html',
  styleUrls: ['./xuat-thanh-ly.component.scss']
})
export class XuatThanhLyComponent implements OnInit {

  defaultUrl: string = 'xuat/xuat-thanh-ly'

  routerUrl: string = "";
  constructor(
    private router: Router,
    public globals: Globals,
    public userService: UserService
  ) {
    router.events.subscribe((val) => {
      this.routerUrl = this.router.url;
      console.log(this.routerUrl);
    })
  }

  routes: any[] = [
    {
      url: '/danh-sach',
      name: 'Toàn bộ danh sách hàng DTQG cần thanh lý',
      accessPermisson: 'XHDTQG_XTL_DSCTL'
    },
    {
      url: '/tong-hop',
      name: 'Tổng hợp danh sách hàng DTQG cần thanh lý',
      accessPermisson: 'XHDTQG_XTL_THDSCTL'
    },
    {
      url: '/trinh-tham-dinh',
      name: 'Trình và thẩm định hồ sơ thanh lý',
      accessPermisson: 'XHDTQG_XTL_HSTL'
    },
    {
      url: '/quyet-dinh',
      name: 'Quyết định thanh lý',
      accessPermisson: 'XHDTQG_XTL_QDTL'
    },
    {
      url: '/thong-bao-kq',
      name: 'Thông báo kết quả trình hồ sơ',
      accessPermisson: 'XHDTQG_XTL_TBKQ'
    },
    {
      url: '/to-chuc',
      name: 'Tổ chức triển khai KH bán đấu giá thanh lý hàng DTQG',
      accessPermisson: 'XHDTQG_XTL_TCKHBDG'
    },
    {
      url: '/xuat-hang',
      name: 'Xuất thanh lý',
      accessPermisson: 'XHDTQG_XTL_XTL'
    },
    {
      url: '/bao-cao-kq',
      name: 'Báo cáo kết quả thanh lý',
      accessPermisson: 'XHDTQG_XTL_BCKQ'
    }
  ]

  ngOnInit(): void {
    if (this.router.url) {
      this.routerUrl = this.router.url;
    }
  }

  redirectUrl(url) {
    console.log(this.defaultUrl + url);
    this.router.navigate([this.defaultUrl + url]);
  }

  checkStatusPermission(data: any, action: any) {
    let mapQuyen = {
      XEM: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC, STATUS.CHODUYET_BTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH,
        STATUS.DA_HOAN_THANH,
      ],
      SUA: [STATUS.DU_THAO, STATUS.TU_CHOI_TP, STATUS.TU_CHOI_LDTC, STATUS.TU_CHOI_LDV, STATUS.TU_CHOI_LDC, STATUS.TU_CHOI_LDCC],
      XOA: [STATUS.DU_THAO],
      DUYET_BTC: [STATUS.CHODUYET_BTC],
      DUYET_LDTC: [STATUS.CHO_DUYET_LDTC],
      DUYET_TP: [STATUS.CHO_DUYET_TP],
      DUYET_LDV: [STATUS.CHO_DUYET_LDV],
      DUYET_LDC: [STATUS.CHO_DUYET_LDC],
      DUYET_LDCC: [STATUS.CHO_DUYET_LDCC],
      DUYET_KTVBQ: [STATUS.CHO_DUYET_KTVBQ],
      DUYET_KT: [STATUS.CHO_DUYET_KT],
      TAO_QD: [STATUS.DA_DUYET_LDV],

      XEM_NO: [
        STATUS.CHO_DUYET_LDTC, STATUS.DA_DUYET_LDTC, STATUS.TU_CHOI_LDTC, STATUS.CHODUYET_BTC,
        STATUS.DU_THAO, STATUS.CHO_DUYET_TP, STATUS.TU_CHOI_TP,
        STATUS.CHO_DUYET_LDC, STATUS.TU_CHOI_LDC, STATUS.DA_DUYET_LDC,
        STATUS.DA_TAO_CBV, STATUS.CHO_DUYET_LDV, STATUS.TU_CHOI_LDV, STATUS.DA_DUYET_LDV,
        STATUS.CHO_DUYET_LDCC, STATUS.DA_DUYET_LDCC, STATUS.TU_CHOI_LDCC,
        STATUS.CHO_DUYET_KTVBQ, STATUS.TU_CHOI_KTVBQ, STATUS.CHO_DUYET_KT, STATUS.TU_CHOI_KT,
        STATUS.BAN_HANH
      ],
      SUA_NO: [],
      XOA_NO: [],
      DUYET_BTC_NO: [],
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
