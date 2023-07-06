import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { ComponentsModule } from "../../../../components/components.module";
import { MainModule } from "../../../../layout/main/main.module";
import { FormsModule } from "@angular/forms";
import { KiemTraChatLuongMenuComponent } from './kiem-tra-chat-luong-menu/kiem-tra-chat-luong-menu.component';
import { BienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/bien-ban-nghiem-thu-bao-quan.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import {DirectivesModule} from "../../../../directives/directives.module";
import {QuanLyBienBanLayMauComponent} from "./quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component";
import {
  ThemMoiBienBanLayMauKhoComponent
} from "./quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component";
import {
  ThanhphanLaymauComponent
} from "./quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component";
import {
  QuanLyPhieuKiemNghiemChatLuongComponent
} from "./quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component";
import {
  ThemMoiPhieuKiemNghiemChatLuongComponent
} from "./quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component";
import { PhieuKtraCluongComponent } from './phieu-ktra-cluong/phieu-ktra-cluong.component';
import { LapPhieuKtraCluongComponent } from './phieu-ktra-cluong/lap-phieu-ktra-cluong/lap-phieu-ktra-cluong.component';
import { BienBanChuanBiKhoComponent } from './bien-ban-chuan-bi-kho/bien-ban-chuan-bi-kho.component';
import { LapBienBanChuanBiKhoComponent } from './bien-ban-chuan-bi-kho/lap-bien-ban-chuan-bi-kho/lap-bien-ban-chuan-bi-kho.component';



@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    KiemTraChatLuongMenuComponent,
    BienBanNghiemThuBaoQuanComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    PhieuKtraCluongComponent,
    LapPhieuKtraCluongComponent,
    QuanLyBienBanLayMauComponent,
    ThemMoiBienBanLayMauKhoComponent,
    ThanhphanLaymauComponent,
    BienBanChuanBiKhoComponent,
    LapBienBanChuanBiKhoComponent,
    ThanhphanLaymauComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    ThanhphanLaymauComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent
  ],
    imports: [
        CommonModule,
        ComponentsModule,
        MainModule,
        FormsModule,
        DirectivesModule,
    ],
  exports: [
    KiemTraChatLuongComponent
  ]
})
export class KiemTraChatLuongModule { }
