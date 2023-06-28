import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {
  BaoCaoKetQuaKiemDinhMauComponent
} from "./bao-cao-ket-qua-kiem-dinh-mau/bao-cao-ket-qua-kiem-dinh-mau.component";
import {
  BienBanLayMauBanGiaoMauComponent
} from "./bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component";
import {PhieuKiemNghiemChatLuongComponent} from "./phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component";
import {
  ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent
} from "./toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component";
import {
  TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent
} from "./tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat.component";
import {
  ChiTietTongHopDsHangDtqgComponent
} from "./tong-hop-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/chi-tiet-tong-hop-ds-hang-dtqg/chi-tiet-tong-hop-ds-hang-dtqg.component";
import {KiemtraChatluongLtTruockhiHethanLuukhoComponent} from "./kiemtra-chatluong-lt-truockhi-hethan-luukho.component";
import {DirectivesModule} from "../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [KiemtraChatluongLtTruockhiHethanLuukhoComponent, BaoCaoKetQuaKiemDinhMauComponent, BienBanLayMauBanGiaoMauComponent, PhieuKiemNghiemChatLuongComponent,
    TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent, ChiTietTongHopDsHangDtqgComponent,
    ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
  ],
  exports: [KiemtraChatluongLtTruockhiHethanLuukhoComponent,
    BaoCaoKetQuaKiemDinhMauComponent, BienBanLayMauBanGiaoMauComponent, PhieuKiemNghiemChatLuongComponent,
    TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent, ChiTietTongHopDsHangDtqgComponent
    ,
    ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongLtTruockhiHethanLuukhoModule {
}
