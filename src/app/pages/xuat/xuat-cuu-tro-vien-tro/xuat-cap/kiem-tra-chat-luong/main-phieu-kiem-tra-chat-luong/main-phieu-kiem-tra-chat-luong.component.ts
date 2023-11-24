import { Component, OnInit, Input } from '@angular/core';
import { MA_QUYEN_PKNCL } from 'src/app/pages/xuat/kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { BienBanLayMauService } from 'src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/BienBanLayMau.service';
import { PhieuKiemNghiemChatLuongService } from 'src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service';
import { QuyetDinhGiaoNvCuuTroService } from 'src/app/services/qlnv-hang/xuat-hang/xuat-cuu-tro-vien-tro/QuyetDinhGiaoNvCuuTro.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'app-main-phieu-kiem-tra-chat-luong',
  templateUrl: './main-phieu-kiem-tra-chat-luong.component.html',
  styleUrls: ['./main-phieu-kiem-tra-chat-luong.component.scss']
})
export class MainPhieuKiemTraChatLuongComponent implements OnInit {
  @Input() loaiVthh: string;
  maQuyenPKNCL: MA_QUYEN_PKNCL = {
    XEM: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_XEM",
    THEM: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_THEM",
    XOA: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_XOA",
    DUYET_TP: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_DUYET_TP",
    DUYET_LDC: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_DUYET_LDCUC",
    IN: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_IN",
    EXPORT: "XHDTQG_XCTVTXC_XC_KTCL_LT_PKNCL_EXP",

  };

  constructor(
    public userService: UserService, public globals: Globals,
    public bienBanLayMauService: BienBanLayMauService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNvCuuTroService: QuyetDinhGiaoNvCuuTroService,
  ) { }

  ngOnInit() {
  }
  tabSelected = 0;
  selectTab(tab) {
    this.tabSelected = tab;
  }

}
