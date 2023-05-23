import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent } from './kiemtra-chatluong-lt-truockhi-hethan-luukho/toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component';
import { TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent } from './kiemtra-chatluong-lt-truockhi-hethan-luukho/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component';
import { BienBanLayMauBanGiaoMauComponent } from './kiemtra-chatluong-lt-truockhi-hethan-luukho/bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component';
import { PhieuKiemNghiemChatLuongComponent } from './kiemtra-chatluong-lt-truockhi-hethan-luukho/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { BaoCaoKetQuaKiemDinhMauComponent } from './kiemtra-chatluong-lt-truockhi-hethan-luukho/bao-cao-ket-qua-kiem-dinh-mau/bao-cao-ket-qua-kiem-dinh-mau.component';



@NgModule({
  declarations: [XuatKhacComponent, KiemtraChatluongVtTbTrongThbhComponent, KiemtraChatluongVtTbTruockhiHethanLuukhoComponent, KiemtraChatluongLtTruockhiHethanLuukhoComponent, XuatHangDtqgThBkkComponent, XuatHangKhoiDanhMucComponent, ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent, TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent, BienBanLayMauBanGiaoMauComponent, PhieuKiemNghiemChatLuongComponent, BaoCaoKetQuaKiemDinhMauComponent],
  imports: [
    CommonModule,
    XuatKhacRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ]
})
export class XuatKhacModule { }
