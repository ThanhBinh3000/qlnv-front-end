import {NgModule} from '@angular/core';
import {CuuTroVienTroComponent} from './cuu-tro-vien-tro.component';
import {XuatKhoComponent} from './xuat-kho/xuat-kho.component';
import {CommonModule} from "@angular/common";
import {CuuTroVienTroRoutingModule} from "./cuu-tro-vien-tro-routing.module";
import {ComponentsModule} from "../../../../components/components.module";
import {DirectivesModule} from "../../../../directives/directives.module";
import {QuyetDinhPheDuyetPhuongAnModule} from "./quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.module";
import {TongHopPhuongAnModule} from "./tong-hop-phuong-an/tong-hop-phuong-an.module";
import {XayDungPhuongAnModule} from "./xay-dung-phuong-an/xay-dung-phuong-an.module";
import {QuyetDinhGnvXuatHangModule} from "./quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.module";
import {KiemTraChatLuongModule} from "./kiem-tra-chat-luong/kiem-tra-chat-luong.module";
import {XuatKhoModule} from "./xuat-kho/xuat-kho.module";

@NgModule({
  declarations: [
    CuuTroVienTroComponent,
    XuatKhoComponent
  ],
  imports: [
    CommonModule,
    CuuTroVienTroRoutingModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPheDuyetPhuongAnModule,
    TongHopPhuongAnModule,
    XayDungPhuongAnModule,
    QuyetDinhGnvXuatHangModule,
    KiemTraChatLuongModule,
    XuatKhoModule
  ],
  exports: [
    CuuTroVienTroComponent,
    XuatKhoComponent
  ]
})
export class CuuTroVienTroModule {
}
