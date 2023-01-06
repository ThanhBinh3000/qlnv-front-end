import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { ChucNangKtComponent } from './chuc-nang-kt/chuc-nang-kt.component';
import { PhieuKiemTraChatLuongComponent } from './phieu-kiem-tra-chat-luong/phieu-kiem-tra-chat-luong.component';
import { ThemMoiPhieuKiemTraChatLuongComponent } from './phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong/them-moi-phieu-kiem-tra-chat-luong.component';
import { BienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/bien-ban-nghiem-thu-bao-quan.component';
import { ThemMoiBienBanNghiemThuBaoQuanComponent } from './bien-ban-nghiem-thu-bao-quan/them-moi-bien-ban-nghiem-thu-bao-quan/them-moi-bien-ban-nghiem-thu-bao-quan.component';
import { BienBanLayBanGiaoMauComponent } from './bien-ban-lay-ban-giao-mau/bien-ban-lay-ban-giao-mau.component';
import { ThemMoiBienBanLayBanGiaoMauComponent } from './bien-ban-lay-ban-giao-mau/them-moi-bien-ban-lay-ban-giao-mau/them-moi-bien-ban-lay-ban-giao-mau.component';
import { PhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { ThemMoiPhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { ThanhPhanLayMauComponent } from './bien-ban-lay-ban-giao-mau/them-moi-bien-ban-lay-ban-giao-mau/thanh-phan-lay-mau/thanh-phan-lay-mau.component';

@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    ChucNangKtComponent,
    PhieuKiemTraChatLuongComponent,
    ThemMoiPhieuKiemTraChatLuongComponent,
    BienBanNghiemThuBaoQuanComponent,
    ThemMoiBienBanNghiemThuBaoQuanComponent,
    BienBanLayBanGiaoMauComponent,
    ThemMoiBienBanLayBanGiaoMauComponent,
    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    ThanhPhanLayMauComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraChatLuongComponent,
    ChucNangKtComponent,
  ]
})
export class KiemTraChatLuongModule { }
