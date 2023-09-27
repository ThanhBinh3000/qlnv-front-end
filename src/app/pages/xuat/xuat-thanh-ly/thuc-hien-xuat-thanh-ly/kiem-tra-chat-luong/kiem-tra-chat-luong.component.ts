import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "src/app/services/user.service";
import {
  BienBanLayMauService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/BienBanLayMau.service";
import {
  QuyetDinhGiaoNhiemVuThanhLyService
} from "src/app/services/qlnv-hang/xuat-hang/xuat-thanh-ly/QuyetDinhGiaoNhiemVuThanhLy.service";
import {
  PhieuKiemNghiemChatLuongService
} from "src/app/services/qlnv-hang/xuat-hang/chung/kiem-tra-chat-luong/PhieuKiemNghiemChatLuong.service";

@Component({
  selector: 'app-kiem-tra-chat-luong',
  templateUrl: './kiem-tra-chat-luong.component.html',
  styleUrls: ['./kiem-tra-chat-luong.component.scss']
})
export class KiemTraChatLuongComponent implements OnInit {
  @Input() loaiVthh: string;

  constructor(
    public bienBanLayMauService: BienBanLayMauService,
    public phieuKiemNghiemChatLuongService: PhieuKiemNghiemChatLuongService,
    public quyetDinhGiaoNhiemVuThanhLyService: QuyetDinhGiaoNhiemVuThanhLyService,
  ) {
  }

  ngOnInit(): void {
  }

  tabSelected: number = 0;

  selectTab(tab: number) {
    this.tabSelected = tab;
  }
}
