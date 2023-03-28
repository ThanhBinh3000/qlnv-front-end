import { NgModule } from '@angular/core';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { CommonModule } from "@angular/common";
import { CuuTroVienTroRoutingModule } from "./cuu-tro-vien-tro-routing.module";
import { ComponentsModule } from "../../../../components/components.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { QuyetDinhPheDuyetPhuongAnModule } from "./quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.module";
import { TongHopPhuongAnModule } from "./tong-hop-phuong-an/tong-hop-phuong-an.module";
import { XayDungPhuongAnModule } from "./xay-dung-phuong-an/xay-dung-phuong-an.module";
import { QuyetDinhGnvXuatHangModule } from "./quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.module";
import { KiemTraChatLuongModule } from "./kiem-tra-chat-luong/kiem-tra-chat-luong.module";
import { XuatKhoModule } from "./xuat-kho/xuat-kho.module";
import {TongHopPhuongAnComponent} from "./tong-hop-phuong-an/tong-hop-phuong-an.component";
import {
  ThongTinTongHopPhuongAnComponent
} from "./tong-hop-phuong-an/thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component";
import {
  QuyetDinhPheDuyetPhuongAnComponent
} from "./quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.component";
import {
  ThongTinQuyetDinhPheDuyetPhuongAnComponent
} from "./quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an.component";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";

@NgModule({
  declarations: [
    CuuTroVienTroComponent,
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
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
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent
  ]
})
export class CuuTroVienTroModule {
}
