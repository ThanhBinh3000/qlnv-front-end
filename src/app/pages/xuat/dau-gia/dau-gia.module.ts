import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {DauGiaRoutingModule} from './dau-gia-routing.module';
import {DauGiaComponent} from './dau-gia.component';
import {GiaoXuatHangModule} from './giao-xuat-hang/giao-xuat-hang.module';
import {HopDongModule} from './hop-dong/hop-dong.module';
import {KiemTraChatLuongModule} from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
import {TrienkhaiLuachonNhathauModule} from './trienkhai-luachon-nhathau/trienkhai-luachon-nhathau.module';
import {KeHoachBanDauGiaComponent} from './ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.component';
import {KeHoachBanDauGiaModule} from "./ke-hoach-ban-dau-gia/ke-hoach-ban-dau-gia.module";
import {ToChucTrienKhaiComponent} from './to-chuc-trien-khai/to-chuc-trien-khai.component';
import {ToChucTrienKhaiModule} from "./to-chuc-trien-khai/to-chuc-trien-khai.module";
import {XuatKhoModule} from './xuat-kho/xuat-kho.module';
import {KiemTraChatLuongComponent} from "./kiem-tra-chat-luong/kiem-tra-chat-luong.component";
import {ChucNangKiemTraComponent} from "./kiem-tra-chat-luong/main/chuc-nang-kiem-tra.component";
import {TableBienBanLayMauComponent} from "./kiem-tra-chat-luong/bien-ban-lay-mau/table-bien-ban-lay-mau.component";
import {
  CreateBienBanLayMauComponent
} from "./kiem-tra-chat-luong/bien-ban-lay-mau/create-bien-ban-lay-mau/create-bien-ban-lay-mau.component";
import {HoSoKyThuatComponent} from "./kiem-tra-chat-luong/ho-so-ky-thuat/ho-so-ky-thuat.component";
import {
  QuanLyPhieuKiemNghiemChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-cl/quan-ly-phieu-kiem-nghiem-chat-luong.component";
import {
  ThemMoiPhieuKiemNghiemChatLuongComponent
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-cl/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component";
import {MainXuatKhoComponent} from "./xuat-kho/main-xuat-kho/main-xuat-kho.component";
import {PhieuXuatKhoComponent} from "./xuat-kho/phieu-xuat-kho/phieu-xuat-kho.component";
import {
  ThemMoiPhieuXuatKhoComponent
} from "./xuat-kho/phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component";
import {BangKeCanComponent} from "./xuat-kho/bang-ke-can/bang-ke-can.component";
import {BienBanTinhKhoComponent} from "./xuat-kho/bien-ban-tinh-kho/bien-ban-tinh-kho.component";
import {
  ThemMoiBienBanTinhKhoComponent
} from "./xuat-kho/bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component";
import {BienBanHaoDoiComponent} from "./xuat-kho/bien-ban-hao-doi/bien-ban-hao-doi.component";
import {
  ThemMoiBienBanHaoDoiComponent
} from "./xuat-kho/bien-ban-hao-doi/them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component";
import {XuatKhoComponent} from "./xuat-kho/xuat-kho.component";
import {ChiTietBangKeCanComponent} from "./xuat-kho/bang-ke-can/chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component";
import {
  CreateDaiDienComponent
} from "./kiem-tra-chat-luong/bien-ban-lay-mau/create-bien-ban-lay-mau/create-dai-dien/create-dai-dien.component";
import {XuatCapModule} from "../xuat-cuu-tro-vien-tro/xuat-cap/xuat-cap.module";
import {CuuTroVienTroModule} from "../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {
  ChiTietHoSoKyThuatComponent
} from "src/app/pages/xuat/dau-gia/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import {
  ChiTietBienBanKiemTraComponent
} from "src/app/pages/xuat/dau-gia/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component";

@NgModule({
  declarations: [
    DauGiaComponent,
    KeHoachBanDauGiaComponent,
    ToChucTrienKhaiComponent,


    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauComponent,
    CreateDaiDienComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    ChiTietBangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
    XuatKhoComponent
  ],
  exports: [
    DauGiaComponent,
    KeHoachBanDauGiaComponent,
    ToChucTrienKhaiComponent,

    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauComponent,
    CreateDaiDienComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    ChiTietBangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
    XuatKhoComponent
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
    XuatKhoModule,
    XuatCapModule,
    CuuTroVienTroModule,


  ]
})
export class DauGiaModule {
}
