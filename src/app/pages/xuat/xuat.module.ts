import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XuatRoutingModule } from './xuat-routing.module';
import { XuatComponent } from './xuat.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { XuatTieuHuyComponent } from './xuat-tieu-huy/xuat-tieu-huy.component';
import { XuatTieuHuyModule } from "./xuat-tieu-huy/xuat-tieu-huy.module";
import { BienBanLayMauComponent } from './kiem-tra-chat-luong/bien-ban-lay-mau/bien-ban-lay-mau.component';
import { ChiTietBienBanLayMauComponent } from './kiem-tra-chat-luong/bien-ban-lay-mau/chi-tiet-bien-ban-lay-mau/chi-tiet-bien-ban-lay-mau.component';
import { PhieuKiemNghiemChatLuongComponent } from './kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { ChiTietPhieuKiemNghiemChatLuongComponent } from './kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/chi-tiet-phieu-kiem-nghiem-chat-luong/chi-tiet-phieu-kiem-nghiem-chat-luong.component';
import { ChiTietQuyetDinhGnvComponent } from './xuat-cuu-tro-vien-tro/xuat-cuu-tro/quyet-dinh-gnv/chi-tiet-quyet-dinh-gnv/chi-tiet-quyet-dinh-gnv.component';
import { ThongTinQuyetDinhXuatCapComponent } from './xuat-cuu-tro-vien-tro/xuat-cap/quyet-dinh-xuat-cap/thong-tin-quyet-dinh-xuat-cap/thong-tin-quyet-dinh-xuat-cap.component';
import { ChiTietQuyetDinhPdComponent } from './xuat-cuu-tro-vien-tro/xuat-cuu-tro/quyet-dinh-pd/chi-tiet-quyet-dinh-pd/chi-tiet-quyet-dinh-pd.component';

@NgModule({
  declarations: [XuatComponent, XuatTieuHuyComponent, ChiTietQuyetDinhGnvComponent, BienBanLayMauComponent, ChiTietBienBanLayMauComponent, PhieuKiemNghiemChatLuongComponent, ChiTietPhieuKiemNghiemChatLuongComponent, ThongTinQuyetDinhXuatCapComponent,
    ChiTietQuyetDinhPdComponent],
  imports: [CommonModule, XuatRoutingModule, ComponentsModule, MainModule, XuatTieuHuyModule],
  exports: [
    BienBanLayMauComponent,
    PhieuKiemNghiemChatLuongComponent,
    ChiTietQuyetDinhGnvComponent,
    ChiTietPhieuKiemNghiemChatLuongComponent,
    ThongTinQuyetDinhXuatCapComponent,
    ChiTietQuyetDinhPdComponent
  ]
})
export class XuatModule { }
