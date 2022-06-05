import { ThemMoiPhieuKiemNghiemChatLuongThocComponent } from './quan-ly-phieu-kiem-nghiem-chat-luong-thoc/them-moi-phieu-kiem-nghiem-chat-luong-thoc/them-moi-phieu-kiem-nghiem-chat-luong-thoc.component';
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
import { ThemMoiBienBanLayMauKhoComponent } from './quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component';
import { ThemMoiBienBanBanGiaoMauComponent } from './quan-ly-bien-ban-ban-giao-mau/them-moi-bien-ban-ban-giao-mau/them-moi-bien-ban-ban-giao-mau.component';

@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    ThongTinBienBanNghiemThuBaoQuanComponent,
    ThongTinBienBanNghiemThuBaoQuanComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    QuanLyBienBanLayMauComponent,
    QuanLyBienBanBanGiaoMauComponent,
    QuanLyPhieuKiemNghiemChatLuongThocComponent,
    ThemMoiBienBanLayMauKhoComponent,
    ThemMoiBienBanBanGiaoMauComponent,
    ThemMoiPhieuKiemNghiemChatLuongThocComponent
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
