import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  BienBanLayMauBanGiaoMauComponent
} from './bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component';
import {
  ThemMoiBbLayMauBanGiaoMauComponent
} from './bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau.component';
import {
  ThanhPhanThamGiaComponent
} from './bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/thanh-phan-tham-gia/thanh-phan-tham-gia.component';
import { PhieuKiemNghiemChatLuongComponent } from './phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import {
  ThemMoiPhieuKnClComponent
} from './phieu-kiem-nghiem-chat-luong/them-moi-phieu-kn-cl/them-moi-phieu-kn-cl.component';
import { KiemTraChatLuongComponent } from "./kiem-tra-chat-luong.component";
import { MainXuatKhoComponent } from "../xuat-kho/main-xuat-kho/main-xuat-kho.component";
import { HoSoKyThuatComponent } from './ho-so-ky-thuat/ho-so-ky-thuat.component';
import { ChiTietHoSoKyThuatComponent } from './ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component';
import { QuyetDinhGnvXuatHangModule } from "../quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.module";


@NgModule({
  declarations: [
    MainComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKnClComponent,
    KiemTraChatLuongComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent
  ],
  exports: [
    KiemTraChatLuongComponent,
    ThemMoiPhieuKnClComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhGnvXuatHangModule
  ]
})
export class KiemTraChatLuongModule {
}
