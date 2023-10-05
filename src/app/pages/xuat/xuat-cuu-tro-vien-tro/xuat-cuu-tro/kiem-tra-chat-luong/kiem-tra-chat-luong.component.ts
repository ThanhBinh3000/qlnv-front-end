import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-kiem-tra-chat-luong',
  templateUrl: './kiem-tra-chat-luong.component.html',
  styleUrls: ['./kiem-tra-chat-luong.component.scss']
})
export class KiemTraChatLuongComponent implements OnInit {
  tabs: any[] = [];
  loaiVthhSelected: string;

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
