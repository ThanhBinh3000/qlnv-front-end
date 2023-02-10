import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ChucNangKiemTraComponent } from './main/chuc-nang-kiem-tra.component';
import { HoSoKyThuatComponent } from './ho-so-ky-thuat/ho-so-ky-thuat.component';
import { ThongTinHoSoKyThuatComponent } from './ho-so-ky-thuat/thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { TableBienBanLayMauComponent } from './bien-ban-lay-mau/table-bien-ban-lay-mau.component';
import { CreateBienBanLayMauKhoComponent } from './bien-ban-lay-mau/create-bien-ban-lay-mau/create-bien-ban-lay-mau.component';
import { QuanLyPhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-cl/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoiPhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-cl/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';

@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauKhoComponent,
    HoSoKyThuatComponent,
    ThongTinHoSoKyThuatComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauKhoComponent,
    HoSoKyThuatComponent,
  ]
})
export class KiemTraChatLuongModule { }
