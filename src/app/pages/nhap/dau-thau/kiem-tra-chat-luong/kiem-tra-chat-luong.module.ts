import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { BienBanChuanBiKhoComponent } from './bien-ban-chuan-bi-kho/bien-ban-chuan-bi-kho.component';
import { ThongTinBienBanChuanBiKhoComponent } from './bien-ban-chuan-bi-kho/thong-tin-bien-ban-chuan-bi-kho/thong-tin-bien-ban-chuan-bi-kho.component';
import { ChucNangKiemTraComponent } from './chuc-nang-kiem-tra/chuc-nang-kiem-tra.component';
import { HoSoKyThuatComponent } from './ho-so-ky-thuat/ho-so-ky-thuat.component';
import { ThongTinHoSoKyThuatComponent } from './ho-so-ky-thuat/thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';
import { QuanLyBienBanLayMauComponent } from './quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component';
import { ThemMoiBienBanLayMauKhoComponent } from './quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';
import { QuanLyPhieuKiemNghiemChatLuongComponent } from './quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoiPhieuKiemNghiemChatLuongComponent } from './quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { ThanhphanLaymauComponent } from './quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/thanhphan-laymau/thanhphan-laymau.component';
import { ThongtinThuchienComponent } from './bien-ban-chuan-bi-kho/thong-tin-bien-ban-chuan-bi-kho/thongtin-thuchien/thongtin-thuchien.component';
import { ThemMoiHoSoKyThuatComponent } from './ho-so-ky-thuat/them-moi-ho-so-ky-thuat/them-moi-ho-so-ky-thuat.component';


@NgModule({
  declarations: [
    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    LapBienBanNghiemThuBaoQuanComponent,
    ThongTinBienBanNghiemThuBaoQuanComponent,
    QuanLyPhieuKiemTraChatLuongHangComponent,
    ThemMoiPhieuKiemTraChatLuongHangComponent,
    QuanLyBienBanLayMauComponent,
    ThemMoiBienBanLayMauKhoComponent,
    BienBanChuanBiKhoComponent,
    ThongTinBienBanChuanBiKhoComponent,
    HoSoKyThuatComponent,
    ThongTinHoSoKyThuatComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    ThanhphanLaymauComponent,
    ThongtinThuchienComponent,
    ThemMoiHoSoKyThuatComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
  ],
    exports: [
        KiemTraChatLuongComponent,
        ChucNangKiemTraComponent,
        LapBienBanNghiemThuBaoQuanComponent,
        QuanLyPhieuKiemTraChatLuongHangComponent,
        QuanLyBienBanLayMauComponent,
        BienBanChuanBiKhoComponent,
        HoSoKyThuatComponent,
        ThemMoiPhieuKiemNghiemChatLuongComponent,
    ]
})
export class KiemTraChatLuongModule { }
