import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { QuanLyPhieuKiemNghiemChatLuongThocComponent } from './quan-ly-phieu-kiem-nghiem-chat-luong-thoc/quan-ly-phieu-kiem-nghiem-chat-luong-thoc.component';
import { QuanLyBienBanBanGiaoMauComponent } from './quan-ly-bien-ban-ban-giao-mau/quan-ly-bien-ban-ban-giao-mau.component';
import { QuanLyBienBanLayMauComponent } from './quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';

@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    ThongTinBienBanNghiemThuBaoQuanComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    ThemMoiPhieuKiemTraChatLuongHangComponent,
    QuanLyBienBanLayMauComponent,
    QuanLyBienBanBanGiaoMauComponent,
    QuanLyPhieuKiemNghiemChatLuongThocComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
  exports: [
    KiemTraChatLuongComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    QuanLyBienBanLayMauComponent,
    QuanLyBienBanBanGiaoMauComponent,
    QuanLyPhieuKiemNghiemChatLuongThocComponent
  ]
})
export class KiemTraChatLuongModule { }
