import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {XuatKhacComponent} from "./xuat-khac.component";
import {
  KiemtraChatluongVtTbTruockhiHethanLuukhoComponent
} from "./kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.component";
import {XuatHangDtqgThBkkComponent} from "./xuat-hang-dtqg-th-bkk/xuat-hang-dtqg-th-bkk.component";
import {XuatHangKhoiDanhMucComponent} from "./xuat-hang-khoi-danh-muc/xuat-hang-khoi-danh-muc.component";
import {XuatKhacRoutingModule} from "./xuat-khac-routing.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";
import {ComponentsModule} from "../../../components/components.module";
import {KeHoachBanDauGiaModule} from "../dau-gia/ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module";
import {
  KiemtraChatluongVtTbTruockhiHethanLuukhoModule
} from "./kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.module";
import {
  KiemtraChatluongLtTruockhiHethanLuukhoModule
} from "./kiemtra-chatluong-lt-truockhi-hethan-luukho/kiemtra-chatluong-lt-truockhi-hethan-luukho.module";
import {
  KiemtraChatluongVtTbTrongThbhComponentModule
} from "./kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh/kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh.module";
import {XuatHangDtqgThBkkModule} from "./xuat-hang-dtqg-th-bkk/xuat-hang-dtqg-th-bkk.module";


@NgModule({
  declarations: [XuatKhacComponent, KiemtraChatluongVtTbTruockhiHethanLuukhoComponent, XuatHangDtqgThBkkComponent, XuatHangKhoiDanhMucComponent],
  imports: [
    CommonModule,
    XuatKhacRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    KeHoachBanDauGiaModule,
    KiemtraChatluongVtTbTruockhiHethanLuukhoModule,
    KiemtraChatluongLtTruockhiHethanLuukhoModule,
    KiemtraChatluongVtTbTrongThbhComponentModule,
    XuatHangDtqgThBkkModule
  ],
  exports: [],
  providers: [DatePipe]
})
export class XuatKhacModule {
}
