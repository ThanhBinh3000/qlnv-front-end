import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {XuatKhacComponent} from "./xuat-khac.component";
import {
  KiemtraChatluongVtTbTrongThbhComponent
} from "./kiemtra-chatluong-vt-tb-trong-thbh/kiemtra-chatluong-vt-tb-trong-thbh.component";
import {
  KiemtraChatluongVtTbTruockhiHethanLuukhoComponent
} from "./kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.component";
import {
  KiemtraChatluongLtTruockhiHethanLuukhoComponent
} from "./kiemtra-chatluong-lt-truockhi-hethan-luukho/kiemtra-chatluong-lt-truockhi-hethan-luukho.component";
import {XuatHangDtqgThBkkComponent} from "./xuat-hang-dtqg-th-bkk/xuat-hang-dtqg-th-bkk.component";
import {XuatHangKhoiDanhMucComponent} from "./xuat-hang-khoi-danh-muc/xuat-hang-khoi-danh-muc.component";
import {XuatKhacRoutingModule} from "./xuat-khac-routing.module";
import {DirectivesModule} from "../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../layout/main/main.module";
import {ComponentsModule} from "../../../components/components.module";
import {
  ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent
} from './kiemtra-chatluong-lt-truockhi-hethan-luukho/toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component';
import {
  TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent
} from './kiemtra-chatluong-lt-truockhi-hethan-luukho/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component';
import {
  BienBanLayMauBanGiaoMauComponent
} from './kiemtra-chatluong-lt-truockhi-hethan-luukho/bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component';
import {
  PhieuKiemNghiemChatLuongComponent
} from './kiemtra-chatluong-lt-truockhi-hethan-luukho/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import {
  ChiTietTongHopDsHangDtqgComponent
} from './kiemtra-chatluong-lt-truockhi-hethan-luukho/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/chi-tiet-tong-hop-ds-hang-dtqg/chi-tiet-tong-hop-ds-hang-dtqg.component';
import {KeHoachBanDauGiaModule} from "../dau-gia/ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module";
import {
  KiemtraChatluongVtTbTruockhiHethanLuukhoModule
} from "./kiemtra-chatluong-vt-tb-truockhi-hethan-luukho/kiemtra-chatluong-vt-tb-truockhi-hethan-luukho.module";
import {
  KiemtraChatluongLtTruockhiHethanLuukhoModule
} from "./kiemtra-chatluong-lt-truockhi-hethan-luukho/kiemtra-chatluong-lt-truockhi-hethan-luukho.module";
import { ToanBoDanhSachComponent } from './xuat-hang-dtqg-th-bkk/toan-bo-danh-sach/toan-bo-danh-sach.component';
import { TongHopDanhSachComponent } from './xuat-hang-dtqg-th-bkk/tong-hop-danh-sach/tong-hop-danh-sach.component';


@NgModule({
  declarations: [XuatKhacComponent, KiemtraChatluongVtTbTrongThbhComponent, KiemtraChatluongVtTbTruockhiHethanLuukhoComponent, XuatHangDtqgThBkkComponent, XuatHangKhoiDanhMucComponent, ToanBoDanhSachComponent, TongHopDanhSachComponent],
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
    KiemtraChatluongLtTruockhiHethanLuukhoModule
  ],
  exports: [],
  providers: [DatePipe]
})
export class XuatKhacModule {
}
