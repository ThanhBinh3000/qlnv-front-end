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
import {CuuTroVienTroModule} from "../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {
  ThemMoiBbLayMauBanGiaoMauComponent
} from "./bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau.component";
import {
  ThongTinDanhSachHdtqgHetHan
} from "./toan-bo-ds-hang-dtqg-hethan-luukho-chua-co-kh-xuat/thong-tin-danh-sach-hdtqg-het-han/thong-tin-danh-sach-hdtqg-het-han";
import {
  ThanhPhanThamGiaComponent
} from "./bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/thanh-phan-tham-gia/thanh-phan-tham-gia.component";
import {
  ThemMoiPhieuKiemNghiemChatLuongComponent
} from "./phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component";
import {
  ThemMoiBaoCaoKetQuaKiemDinhMauComponent
} from "./bao-cao-ket-qua-kiem-dinh-mau/them-moi-bao-cao-ket-qua-kiem-dinh-mau/them-moi-bao-cao-ket-qua-kiem-dinh-mau.component";


@NgModule({
  declarations: [
    KiemtraChatluongLtTruockhiHethanLuukhoComponent,
    BaoCaoKetQuaKiemDinhMauComponent,
    ThemMoiBaoCaoKetQuaKiemDinhMauComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent,
    ChiTietTongHopDsHangDtqgComponent,
    ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent,
    ThongTinDanhSachHdtqgHetHan
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    CuuTroVienTroModule,
  ],
  exports: [
    KiemtraChatluongLtTruockhiHethanLuukhoComponent,
    BaoCaoKetQuaKiemDinhMauComponent,
    ThemMoiBaoCaoKetQuaKiemDinhMauComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    TongHopDsHangDtqgHethanLuukhoChuaCoKhXuatComponent,
    ChiTietTongHopDsHangDtqgComponent,
    ToanBoDsHangDtqgHethanLuukhoChuaCoKhXuatComponent,
    ThongTinDanhSachHdtqgHetHan
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongLtTruockhiHethanLuukhoModule {
}
