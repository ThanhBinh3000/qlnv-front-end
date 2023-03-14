import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { DauGiaRoutingModule } from './dau-gia-routing.module';
import { DauGiaComponent } from './dau-gia.component';
import { GiaoXuatHangModule } from './giao-xuat-hang/giao-xuat-hang.module';
import { HopDongModule } from './hop-dong/hop-dong.module';
import { KiemTraChatLuongModule } from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import { TrienkhaiLuachonNhathauModule } from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module';
import { KeHoachBanDauGiaComponent } from './ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.component';
import { KeHoachBanDauGiaModule } from "./ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module";
import { ToChucTrienKhaiComponent } from './to-chuc-trien-khai/to-chuc-trien-khai.component';
import { ToChucTrienKhaiModule } from "./to-chuc-trien-khai/to-chuc-trien-khai.module";
import { DieuchinhKhbdgComponent } from './dieuchinh-khbdg/dieuchinh-khbdg.component';
import { DieuchinhKhbdgModule } from "./dieuchinh-khbdg/dieuchinh-khbdg.module";
import { XuatKhoModule } from './xuat-kho/xuat-kho.module';

@NgModule({
  declarations: [
    DauGiaComponent,
    KeHoachBanDauGiaComponent,
    ToChucTrienKhaiComponent,
    DieuchinhKhbdgComponent,
  ],
  imports: [
    CommonModule,
    DauGiaRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KiemTraChatLuongModule,
    GiaoXuatHangModule,
    HopDongModule,
    TrienkhaiLuachonNhathauModule,
    KeHoachBanDauGiaModule,
    ToChucTrienKhaiModule,
    DieuchinhKhbdgModule,
    XuatKhoModule
  ],
})
export class DauGiaModule {
}
