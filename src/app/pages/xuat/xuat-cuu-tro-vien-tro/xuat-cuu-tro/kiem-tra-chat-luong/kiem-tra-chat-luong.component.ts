// import { Component, OnInit } from '@angular/core';
// import { DanhMucService } from 'src/app/services/danhmuc.service';
// import { Globals } from 'src/app/shared/globals';
// import { MESSAGE } from 'src/app/constants/message';
// import {
//   BienBanLayMauService
// } from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/BienBanLayMau.service";
// import {
//   PhieuKiemNghiemChatLuongService
// } from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service";
// import {
//   QuyetDinhGiaoNhiemVuThanhLyService
// } from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
// import {
//   QuyetDinhGiaoNvCuuTroService
// } from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
// import { MA_QUYEN_PKNCL } from '../../../kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';

// @Component({
//   selector: 'app-kiem-tra-chat-luong',
//   templateUrl: './kiem-tra-chat-luong.component.html',
//   styleUrls: ['./kiem-tra-chat-luong.component.scss']
// })
// export class KiemTraChatLuongComponent implements OnInit {
//   tabs: any[] = [];
//   loaiVthhSelected: string;
//   maQuyen: MA_QUYEN_PKNCL = {
//     XEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_XEM",
//     THEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_THEM",
//     XOA: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_XOA",
//     DUYET_TP: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_DUYET_TP",
//     DUYET_LDC: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_DUYET_LDCUC",
//     IN: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_IN",
//     EXPORT: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_EXP",

//   };

//   constructor(
//     private danhMucService: DanhMucService,
//     public globals: Globals,
//     public bienBanLayMauService: BienBanLayMauService,
//     public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
//     public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
//   ) {
//   }

//   ngOnInit(): void {
//     //this.loaiVTHHGetAll();
//   }

//   async loaiVTHHGetAll() {
//     this.tabs = [];
//     let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
//     if (res.msg == MESSAGE.SUCCESS) {
//       if (res.data && res.data.length > 0) {
//         res.data.forEach((element) => {
//           element.count = 0;
//           this.tabs.push(element);
//         });
//         this.selectTab(this.tabs[0].ma);
//       }
//     }
//   }

//   /*  selectTab(loaiVthh) {
//       this.loaiVthhSelected = loaiVthh;
//     }*/
//   tabSelected = 0;

//   selectTab(tab) {
//     this.tabSelected = tab;
//   }
// }

import { Component, Input, OnInit } from '@angular/core';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { Globals } from 'src/app/shared/globals';
import { MESSAGE } from 'src/app/constants/message';
import {
  BienBanLayMauService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/BienBanLayMau.service";
import {
  PhieuKiemNghiemChatLuongService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  QuyetDinhGiaoNvCuuTroService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service";
import { MA_QUYEN_PKNCL } from '../../../kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { MA_QUYEN_BBLM } from '../../../kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component';

@Component({
  selector: 'app-kiem-tra-chat-luong',
  templateUrl: './kiem-tra-chat-luong.component.html',
  styleUrls: ['./kiem-tra-chat-luong.component.scss']
})
export class KiemTraChatLuongComponent implements OnInit {
  @Input() typeVthh: string;
  tabs: any[] = [];
  loaiVthhSelected: string;
  maQuyenPKNCL: MA_QUYEN_PKNCL = {
    XEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_XEM",
    THEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_THEM",
    XOA: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_XOA",
    DUYET_TP: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_DUYET_TP",
    DUYET_LDC: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_DUYET_LDCUC",
    IN: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_IN",
    EXPORT: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_PKNCL_EXP",

  };
  maQuyenBBLM: MA_QUYEN_BBLM = {
    XEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_XEM",
    THEM: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_THEM",
    XOA: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_XOA",
    DUYET_LDCC: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_DUYET_LDCCUC",
    IN: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_IN",
    EXPORT: "XHDTQG_XCTVTXC_CTVT_KTCL_LT_BBLMBGM_EXP",

  };

  constructor(
    private danhMucService: DanhMucService,
    public globals: Globals,
    public bienBanLayMauService: BienBanLayMauService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
  ) {
  }

  ngOnInit(): void {
    //this.loaiVTHHGetAll();
  }

  async loaiVTHHGetAll() {
    this.tabs = [];
    let res = await this.danhMucService.loaiVatTuHangHoaGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      if (res.data && res.data.length > 0) {
        res.data.forEach((element) => {
          element.count = 0;
          this.tabs.push(element);
        });
        this.selectTab(this.tabs[0].ma);
      }
    }
  }

  /*  selectTab(loaiVthh) {
      this.loaiVthhSelected = loaiVthh;
    }*/
  tabSelected = 0;

  selectTab(tab) {
    this.tabSelected = tab;
  }
}

