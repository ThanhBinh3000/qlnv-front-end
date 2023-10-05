import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhacComponent } from "./khac.component";
import { KhacRoutingModule } from "./khac-routing.module";
import { ComponentsModule } from "../../../components/components.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { KeHoachNhapKhacModule } from "./ke-hoach-nhap-khac/ke-hoach-nhap-khac.module";
import { QuyetDinhPdKhnkModule } from "./quyet-dinh-pd-khnk/quyet-dinh-pd-khnk.module";
import { TongHopKhnkModule } from "./tong-hop-khnk/tong-hop-khnk.module";
import { QuyetDinhGiaoNvNhapHangModule } from "./quyet-dinh-giao-nv-nhap-hang/quyet-dinh-giao-nv-nhap-hang.module";
import { NhapKhoModule } from "./nhap-kho/nhap-kho.module";
import { KiemTraChatLuongModule } from "./kiem-tra-chat-luong/kiem-tra-chat-luong.module";



@NgModule({
  declarations: [KhacComponent],
  imports: [
    CommonModule,
    KhacRoutingModule,
    ComponentsModule,
    DirectivesModule,
    KeHoachNhapKhacModule,
    QuyetDinhPdKhnkModule,
    TongHopKhnkModule,
    QuyetDinhGiaoNvNhapHangModule,
    NhapKhoModule,
    KiemTraChatLuongModule
  ]
})
export class KhacModule { }
