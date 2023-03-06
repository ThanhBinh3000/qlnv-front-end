import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { XuatCapComponent } from "./xuat-cap.component";
import { XuatCapRoutingModule } from "./xuat-cap-routing.module";
import { ComponentsModule } from "../../../../components/components.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { QuyetDinhPhuongAnModule } from "./quyet-dinh-phuong-an/quyet-dinh-phuong-an.module";
import { QuyetDinhXuatCapModule } from "./quyet-dinh-xuat-cap/quyet-dinh-xuat-cap.module";
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { KiemTraChatLuongModule } from "./kiem-tra-chat-luong/kiem-tra-chat-luong.module";
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { XuatKhoModule } from './xuat-kho/xuat-kho.module';

@NgModule({
  declarations: [
    XuatCapComponent,
    XuatKhoComponent,


  ],
  exports: [
    XuatCapComponent
  ],
  imports: [

    CommonModule,
    XuatCapRoutingModule,
    ComponentsModule,
    DirectivesModule,
    QuyetDinhPhuongAnModule,
    QuyetDinhXuatCapModule,
    KiemTraChatLuongModule,
    XuatKhoModule
  ]
})
export class XuatCapModule {
}
