import { NgModule } from '@angular/core';
import { CuuTroVienTroComponent } from './cuu-tro-vien-tro.component';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { CommonModule } from "@angular/common";
import { CuuTroVienTroRoutingModule } from "./cuu-tro-vien-tro-routing.module";
import { ComponentsModule } from "../../../../components/components.module";
import { DirectivesModule } from "../../../../directives/directives.module";
import { TongHopPhuongAnComponent } from "./tong-hop-phuong-an/tong-hop-phuong-an.component";
import {
  ThongTinTongHopPhuongAnComponent
} from "./tong-hop-phuong-an/thong-tin-tong-hop-phuong-an/thong-tin-tong-hop-phuong-an.component";
import {
  QuyetDinhPheDuyetPhuongAnComponent
} from "./quyet-dinh-phe-duyet-phuong-an/quyet-dinh-phe-duyet-phuong-an.component";
import {
  ThongTinQuyetDinhPheDuyetPhuongAnComponent
} from "./quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an/thong-tin-quyet-dinh-phe-duyet-phuong-an.component";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { MainComponent } from "./kiem-tra-chat-luong/main/main.component";
import {
  BienBanLayMauBanGiaoMauComponent
} from "./kiem-tra-chat-luong/bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component";
import {
  ThemMoiBbLayMauBanGiaoMauComponent
} from "./kiem-tra-chat-luong/bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau.component";
import {
  ThanhPhanThamGiaComponent
} from "./kiem-tra-chat-luong/bien-ban-lay-mau-ban-giao-mau/them-moi-bb-lay-mau-ban-giao-mau/thanh-phan-tham-gia/thanh-phan-tham-gia.component";
import {
  PhieuKiemNghiemChatLuongComponent1
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component";
import {
  ThemMoiPhieuKnClComponent
} from "./kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/them-moi-phieu-kn-cl/them-moi-phieu-kn-cl.component";
import { KiemTraChatLuongComponent } from "./kiem-tra-chat-luong/kiem-tra-chat-luong.component";
import { HoSoKyThuatComponent } from "./kiem-tra-chat-luong/ho-so-ky-thuat/ho-so-ky-thuat.component";
import {
  ChiTietHoSoKyThuatComponent
} from "./kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import { QuyetDinhGnvXuatHangComponent } from "./quyet-dinh-gnv-xuat-hang/quyet-dinh-gnv-xuat-hang.component";
import {
  ThongTinQdGnvXuatHangComponent
} from "./quyet-dinh-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang/thong-tin-qd-gnv-xuat-hang.component";
import { XayDungPhuongAnComponent } from "./xay-dung-phuong-an/xay-dung-phuong-an.component";
import {
  ThongTinXayDungPhuongAnComponent
} from "./xay-dung-phuong-an/thong-tin-xay-dung-phuong-an/thong-tin-xay-dung-phuong-an.component";
import { MainXuatKhoComponent } from "./xuat-kho/main-xuat-kho/main-xuat-kho.component";
import { PhieuXuatKhoComponent } from "./xuat-kho/phieu-xuat-kho/phieu-xuat-kho.component";
import {
  ThemMoiPhieuXuatKhoComponent
} from "./xuat-kho/phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component";
import { BangKeCanComponent } from "./xuat-kho/bang-ke-can/bang-ke-can.component";
import { BienBanTinhKhoComponent } from "./xuat-kho/bien-ban-tinh-kho/bien-ban-tinh-kho.component";
import {
  ThemMoiBienBanTinhKhoComponent
} from "./xuat-kho/bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component";
import { BienBanHaoDoiComponent } from "./xuat-kho/bien-ban-hao-doi/bien-ban-hao-doi.component";
import {
  ThemMoiBienBanHaoDoiComponent
} from "./xuat-kho/bien-ban-hao-doi/them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component";
import { ChiTietBangKeCanComponent } from "./xuat-kho/bang-ke-can/chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component";
import {
  ChiTietBienBanKiemTraComponent
} from './kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component';
import { DeXuatComponent } from './de-xuat/de-xuat.component';
import { ChiTietDeXuatComponent } from './de-xuat/chi-tiet-de-xuat/chi-tiet-de-xuat.component';
import { TongHopComponent } from './tong-hop/tong-hop.component';
import { ChiTietTongHopComponent } from './tong-hop/chi-tiet-tong-hop/chi-tiet-tong-hop.component';
import { QuyetDinhPdComponent } from './quyet-dinh-pd/quyet-dinh-pd.component';
import { QuyetDinhGnvComponent } from './quyet-dinh-gnv/quyet-dinh-gnv.component';
import { ChiTietQuyetDinhPdComponent } from './quyet-dinh-pd/chi-tiet-quyet-dinh-pd/chi-tiet-quyet-dinh-pd.component';
import { ChiTietQuyetDinhGnvComponent } from './quyet-dinh-gnv/chi-tiet-quyet-dinh-gnv/chi-tiet-quyet-dinh-gnv.component';
import { XuatModule } from "src/app/pages/xuat/xuat.module";
import { ChucNangKiemTraChatLuongComponent } from './chuc-nang-kiem-tra-chat-luong/chuc-nang-kiem-tra-chat-luong.component';

@NgModule({
  declarations: [
    CuuTroVienTroComponent,
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,


    MainComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongComponent1,
    ThemMoiPhieuKnClComponent,
    KiemTraChatLuongComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChucNangKiemTraChatLuongComponent,

    QuyetDinhGnvXuatHangComponent,
    ThongTinQdGnvXuatHangComponent,

    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
    XuatKhoComponent,

    ChiTietBangKeCanComponent,
    ChiTietBienBanKiemTraComponent,
    DeXuatComponent,
    ChiTietDeXuatComponent,
    TongHopComponent,
    ChiTietTongHopComponent,
    QuyetDinhPdComponent,
    QuyetDinhGnvComponent,
    // ChiTietQuyetDinhPdComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    CuuTroVienTroRoutingModule,
    XuatModule,
  ],
  exports: [
    CuuTroVienTroComponent,
    TongHopPhuongAnComponent,
    ThongTinTongHopPhuongAnComponent,
    QuyetDinhPheDuyetPhuongAnComponent,
    ThongTinQuyetDinhPheDuyetPhuongAnComponent,


    MainComponent,
    BienBanLayMauBanGiaoMauComponent,
    ThemMoiBbLayMauBanGiaoMauComponent,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongComponent1,
    ThemMoiPhieuKnClComponent,
    KiemTraChatLuongComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChucNangKiemTraChatLuongComponent,

    QuyetDinhGnvXuatHangComponent,
    ThongTinQdGnvXuatHangComponent,

    XayDungPhuongAnComponent,
    ThongTinXayDungPhuongAnComponent,

    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
    XuatKhoComponent,

    ChiTietBangKeCanComponent,
    ChiTietBienBanKiemTraComponent,
    QuyetDinhGnvComponent,
    QuyetDinhPdComponent
  ]
})
export class CuuTroVienTroModule {
}
