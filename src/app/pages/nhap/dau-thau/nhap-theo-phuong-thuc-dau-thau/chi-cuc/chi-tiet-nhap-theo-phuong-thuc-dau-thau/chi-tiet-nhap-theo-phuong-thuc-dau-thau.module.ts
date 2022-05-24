import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { ChiTietNhapTheoPhuongThucDauThauRoutingModule } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau-routing.module';
import { ChiTietNhapTheoPhuongThucDauThauComponent } from './chi-tiet-nhap-theo-phuong-thuc-dau-thau.component';
import { LapBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/lap-bien-ban-nghiem-thu-bao-quan.component';
import { ThongTinBienBanNghiemThuBaoQuanComponent } from './lap-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan/thong-tin-bien-ban-nghiem-thu-bao-quan.component';
import { QuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/quan-ly-bang-ke-can-hang.component';
import { ThongTinQuanLyBangKeCanHangComponent } from './quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang/thong-tin-quan-ly-bang-ke-can-hang.component';
import { QuanLyBienBanLayMauComponent } from './quan-ly-bien-ban-lay-mau/quan-ly-bien-ban-lay-mau.component';
import { ThemMoiBienBanLayMauKhoComponent } from './quan-ly-bien-ban-lay-mau/them-moi-bien-ban-lay-mau/them-moi-bien-ban-lay-mau.component';
import { QuanLyPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/quan-ly-phieu-kiem-tra-chat-luong-hang.component';
import { ThemMoiPhieuKiemTraChatLuongHangComponent } from './quan-ly-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang/them-moi-phieu-kiem-tra-chat-luong-hang.component';
import { QuanLyPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/quan-ly-phieu-nhap-kho.component';
import { ThemMoiPhieuNhapKhoComponent } from './quan-ly-phieu-nhap-kho/them-moi-phieu-nhap-kho/them-moi-phieu-nhap-kho.component';



@NgModule({
    declarations: [
        ChiTietNhapTheoPhuongThucDauThauComponent,
        LapBienBanNghiemThuBaoQuanComponent,
        ThongTinBienBanNghiemThuBaoQuanComponent,
        QuanLyPhieuKiemTraChatLuongHangComponent,
        ThemMoiPhieuKiemTraChatLuongHangComponent,
        QuanLyPhieuNhapKhoComponent,
        ThemMoiPhieuNhapKhoComponent,
        QuanLyBangKeCanHangComponent,
        ThongTinQuanLyBangKeCanHangComponent,
        QuanLyBienBanLayMauComponent,
        ThemMoiBienBanLayMauKhoComponent
    ],
    imports: [
        CommonModule,
        ChiTietNhapTheoPhuongThucDauThauRoutingModule,
        ComponentsModule,
        MainModule
    ]
})
export class ChiTietNhapTheoPhuongThucDauThauModule { }
