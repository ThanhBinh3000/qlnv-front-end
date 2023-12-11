import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";
import { ComponentsModule } from "../../../components/components.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { XuatDieuChuyenRoutingModule } from "./xuat-dieu-chuyen-routing.module";
import { XuatDieuChuyenComponent } from "./xuat-dieu-chuyen.component";
import { DcnbXuatNoiBoChiCucComponent } from "./noi-bo-chi-cuc/dcnb-xuat-noi-bo-chi-cuc.component";
import { DcnbNbccThayDoiThuKhoComponent } from "./noi-bo-chi-cuc/thay-doi-thu-kho/dcnb-nbcc-thay-doi-thu-kho.component";
import { DcnbNbccKhongThayDoiThuKhoComponent } from "./noi-bo-chi-cuc/khong-thay-doi-thu-kho/dcnb-nbcc-khong-thay-doi-thu-kho.component";
import {
  NbccTdtkXuatKhoLuongThucComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/nbcc-tdtk-xuat-kho-luong-thuc.component";
import {
  DcnbNbccTdtkXuatKhoVatTuComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-vat-tu/dcnb-nbcc-tdtk-xuat-kho-vat-tu.component";
import {
  NbccKtdtkXuatKhoLuongThucComponent
} from "./noi-bo-chi-cuc/khong-thay-doi-thu-kho/xuat-kho-luong-thuc/nbcc-ktdtk-xuat-kho-luong-thuc.component";
import {
  NbccKtdtkXuatKhoVatTuComponent
} from "./noi-bo-chi-cuc/khong-thay-doi-thu-kho/xuat-kho-vat-tu/nbcc-ktdtk-xuat-kho-vat-tu.component";
import {
  NbccTdtkXkltBienBanTinhKhoComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/bien-ban-tinh-kho/nbcc-tdtk-xklt-bien-ban-tinh-kho.component";
import {
  NbccTdtkXkltPhieuXuatKhoComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/phieu-xuat-kho/nbcc-tdtk-xklt-phieu-xuat-kho.component";
import {
  DcnbNbccTdtkXkvtPhieuXuatKhoComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-vat-tu/phieu-xuat-kho/dcnb-nbcc-tdtk-xkvt-phieu-xuat-kho.component";
import {
  NbccTdtkKiemTraChatLuongVatTuComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-vat-tu/nbcc-tdtk-kiem-tra-chat-luong-vat-tu.component";
import {
  NbccTdtkKtclvtPhieuKiemNghiemChatLuongComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-vat-tu/phieu-kiem-nghiem-chat-luong/nbcc-tdtk-ktclvt-phieu-kiem-nghiem-chat-luong.component";
import {
  NbccTdtkKtclvtHoSoKyThuatComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-vat-tu/ho-so-ky-thuat/nbcc-tdtk-ktclvt-ho-so-ky-thuat.component";
import {
  NbccTdtkKtclvtBienBanLayMauBanGiaoComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-vat-tu/bien-ban-lay-mau-ban-giao/nbcc-tdtk-ktclvt-bien-ban-lay-mau-ban-giao.component";
import {
  NbccTdtkKtclltBienBanLayMauBanGiaoComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-luong-thuc/bien-ban-lay-mau-ban-giao/nbcc-tdtk-ktcllt-bien-ban-lay-mau-ban-giao.component";
import {
  NbccTdtkKtclltPhieuKiemNghiemChatLuongComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-luong-thuc/phieu-kiem-nghiem-chat-luong/nbcc-tdtk-ktcllt-phieu-kiem-nghiem-chat-luong.component";
import {
  NbccTdtkKiemTraChatLuongLuongThucComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/kiem-tra-chat-luong-luong-thuc/nbcc-tdtk-kiem-tra-chat-luong-luong-thuc.component";
import { GhccGiuaHaiChiCucComponent } from "./giua-hai-chi-cuc/ghcc-giua-hai-chi-cuc.component";
import { DanhSachBienBanLayMau } from './component-chung/danh-sach-bien-ban-lay-mau/danh-sach-bien-ban-lay-mau.component';
import { ChiTietDanhSachBienBanLayMau } from './component-chung/danh-sach-bien-ban-lay-mau/chi-tiet-danh-sach-bien-ban-lay-mau/chi-tiet-danh-sach-bien-ban-lay-mau.component';
import { ThanhPhanThamGiaComponent } from './component-chung/danh-sach-bien-ban-lay-mau/chi-tiet-danh-sach-bien-ban-lay-mau/thanh-phan-tham-gia/thanh-phan-tham-gia.component';
import { PhieuKiemNghiemChatLuongXuatDieuChuyenComponent } from './component-chung/quan-ly-phieu-kiem-nghiem-chat-luong/quan-ly-phieu-kiem-nghiem-chat-luong.component';
import { ThemMoiPhieuKiemNghiemChatLuongXuatDieuChuyenComponent } from './component-chung/quan-ly-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong/them-moi-phieu-kiem-nghiem-chat-luong.component';
import { QuyetDinhDieuChuyenModule } from '../quyet-dinh-dieu-chuyen/quyet-dinh-dieu-chuyen.module';
import { ThemMoiPhieuXuatKhoDCNBComponent } from './component-chung/phieu-xuat-kho/them-moi-phieu-xuat-kho/them-moi-phieu-xuat-kho.component';
import { PhieuXuatKhoDCNBComponent } from './component-chung/phieu-xuat-kho/phieu-xuat-kho.component';
import { BangKeCanXuatDieuChuyenComponent } from './component-chung/bang-ke-can/bang-ke-can.component';
import { ChiTietBangKeCanDieuChuyenComponent } from './component-chung/bang-ke-can/chi-tiet-bang-ke-can/chi-tiet-bang-ke-can.component';
import { NbccTdtkXkltBangKeCanHangComponent } from './noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/bang-ke-can-hang/nbcc-tdtk-xklt-bang-ke-can-hang.component';
import { BienBanTinhKhoDieuChuyenComponent } from './component-chung/bien-ban-tinh-kho/bien-ban-tinh-kho.component';
import { ThemMoiBienBanTinhKhoDieuChuyenComponent } from './component-chung/bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component';
import { BienBanHaoDoiDieuChuyenComponent } from './component-chung/bien-ban-hao-doi/bien-ban-hao-doi.component';
import { ThemMoiBienBanHaoDoiDieuChuyenComponent } from './component-chung/bien-ban-hao-doi/them-moi-bien-ban-hao-doi/them-moi-bien-ban-hao-doi.component';
import { NbccTdtkXkltBienBanHaoDoiComponent } from './noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/bien-ban-hao-doi/nbcc-tdtk-xklt-bien-ban-hao-doi.component';
import { BangKeXuatVatTuDieuChuyenComponent } from './component-chung/bang-ke-xuat-vat-tu/bang-ke-xuat-vat-tu.component';
import { NbccTdtkXkvtBangKeXuatVatTuComponent } from './noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-vat-tu/bang-ke-xuat-vat-tu/dcnb-nbcc-tdtk-xkvt-bang-ke-xuat-vat-tu.component';
import { NbccTdtkXkvtBienBanTinhKhoComponent } from './noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-vat-tu/bien-ban-tinh-kho/nbcc-tdtk-xkvt-bien-ban-tinh-kho.component';
import { GhccKtclltBienBanLayMauBanGiaoComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-luong-thuc/bien-ban-lay-mau-ban-giao/ghcc-ktcllt-bien-ban-lay-mau-ban-giao.component';
import { GhccKtclltPhieuKiemNghiemChatLuongComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-luong-thuc/phieu-kiem-nghiem-chat-luong/ghcc-ktcllt-phieu-kiem-nghiem-chat-luong.component';
import { GhccKiemTraChatLuongLuongThucComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-luong-thuc/ghcc-kiem-tra-chat-luong-luong-thuc.component';
import { GhccKiemTraChatLuongVatTuComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-vat-tu/ghcc-kiem-tra-chat-luong-vat-tu.component';
import { GhccKtclvtBienBanLayMauBanGiaoComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-vat-tu/bien-ban-lay-mau-ban-giao/ghcc-ktclvt-bien-ban-lay-mau-ban-giao.component';
import { GhccKtclvtPhieuKiemNghiemChatLuongComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-vat-tu/phieu-kiem-nghiem-chat-luong/ghcc-ktclvt-phieu-kiem-nghiem-chat-luong.component';
import { GhccKtclvtHoSoKyThuatComponent } from './giua-hai-chi-cuc/kiem-tra-chat-luong-vat-tu/ho-so-ky-thuat/ghcc-ktclvt-ho-so-ky-thuat.component';
import { GhccXuatKhoLuongThucComponent } from './giua-hai-chi-cuc/xuat-kho-luong-thuc/ghcc-xuat-kho-luong-thuc.component';
import { GhccXkltPhieuXuatKhoComponent } from './giua-hai-chi-cuc/xuat-kho-luong-thuc/phieu-xuat-kho/ghcc-xklt-phieu-xuat-kho.component';
import { GhccXkltBangKeCanHangComponent } from './giua-hai-chi-cuc/xuat-kho-luong-thuc/bang-ke-can-hang/ghcc-xklt-bang-ke-can-hang.component';
import { GhccXkltBienBanTinhKhoComponent } from './giua-hai-chi-cuc/xuat-kho-luong-thuc/bien-ban-tinh-kho/ghcc-xklt-bien-ban-tinh-kho.component';
import { GhccXkltBienBanHaoDoiComponent } from './giua-hai-chi-cuc/xuat-kho-luong-thuc/bien-ban-hao-doi/ghcc-xklt-bien-ban-hao-doi.component';
import { GhccXuatKhoVatTuComponent } from './giua-hai-chi-cuc/xuat-kho-vat-tu/ghcc-xuat-kho-vat-tu.component';
import { GhccXkvtPhieuXuatKhoComponent } from './giua-hai-chi-cuc/xuat-kho-vat-tu/phieu-xuat-kho/ghcc-xkvt-phieu-xuat-kho.component';
import { GhccXkvtBangKeXuatVatTuComponent } from './giua-hai-chi-cuc/xuat-kho-vat-tu/bang-ke-xuat-vat-tu/ghcc-xkvt-bang-ke-xuat-vat-tu.component';
import { GhccXkvtBienBanTinhKhoComponent } from './giua-hai-chi-cuc/xuat-kho-vat-tu/bien-ban-tinh-kho/ghcc-xkvt-bien-ban-tinh-kho.component';
import { NbccTdtkXkltBangKeXuatVatTuComponent } from './noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/bang-ke-xuat-vat-tu/nbcc-tdtk-xklt-bang-ke-xuat-vat-tu.component';
import { DCNBGiuaHaiCucComponent } from './giua-hai-cuc/dcnb-giua-hai-cuc.component';
import { DCNBGHCKiemTraChatLuongLuongThucComponent } from './giua-hai-cuc/kiem-tra-chat-luong-luong-thuc/dcnb-ghc-kiem-tra-chat-luong-luong-thuc.component';
import { DCNBGHCKtclltBienBanLayMauBanGiaoComponent } from './giua-hai-cuc/kiem-tra-chat-luong-luong-thuc/bien-ban-lay-mau-ban-giao/dcnb-ghc-ktcllt-bien-ban-lay-mau-ban-giao.component';
import { DCNBGHCKtclltPhieuKiemNghiemChatLuongComponent } from './giua-hai-cuc/kiem-tra-chat-luong-luong-thuc/phieu-kiem-nghiem-chat-luong/dcnb-ghc-ktcllt-phieu-kiem-nghiem-chat-luong.component';
import { DCNBGHCKiemTraChatLuongVatTuComponent } from './giua-hai-cuc/kiem-tra-chat-luong-vat-tu/dcnb-ghc-kiem-tra-chat-luong-vat-tu.component';
import { DCNBGHCKtclvtBienBanLayMauBanGiaoComponent } from './giua-hai-cuc/kiem-tra-chat-luong-vat-tu/bien-ban-lay-mau-ban-giao/dcnb-ghc-ktclvt-bien-ban-lay-mau-ban-giao.component';
import { DCNBGHCKtclvtPhieuKiemNghiemChatLuongComponent } from './giua-hai-cuc/kiem-tra-chat-luong-vat-tu/phieu-kiem-nghiem-chat-luong/dcnb-ghc-ktclvt-phieu-kiem-nghiem-chat-luong.component';
import { DCNBGHCXuatKhoLuongThucComponent } from './giua-hai-cuc/xuat-kho-luong-thuc/dcnb-ghc-xuat-kho-luong-thuc.component';
import { DCNBGHCXkltPhieuXuatKhoComponent } from './giua-hai-cuc/xuat-kho-luong-thuc/phieu-xuat-kho/dcnb-ghc-xklt-phieu-xuat-kho.component';
import { DCNBGHCXkltBangKeCanHangComponent } from './giua-hai-cuc/xuat-kho-luong-thuc/bang-ke-can-hang/dcnb-ghc-xklt-bang-ke-can-hang.component';
import { DCNBGHCXkltBienBanTinhKhoComponent } from './giua-hai-cuc/xuat-kho-luong-thuc/bien-ban-tinh-kho/dcnb-ghc-xklt-bien-ban-tinh-kho.component';
import { DCNBGHCXkltBienBanHaoDoiComponent } from './giua-hai-cuc/xuat-kho-luong-thuc/bien-ban-hao-doi/dcnb-ghc-xklt-bien-ban-hao-doi.component';
import { DCNBGHCXuatKhoVatTuComponent } from './giua-hai-cuc/xuat-kho-vat-tu/dcnb-ghc-xuat-kho-vat-tu.component';
import { DCNBGHCXkvtPhieuXuatKhoComponent } from './giua-hai-cuc/xuat-kho-vat-tu/phieu-xuat-kho/dcnb-ghc-xkvt-phieu-xuat-kho.component';
import { DCNBGHCXkvtBangKeXuatVatTuComponent } from './giua-hai-cuc/xuat-kho-vat-tu/bang-ke-xuat-vat-tu/dcnb-ghc-xkvt-bang-ke-xuat-vat-tu.component';
import { DCNBGHCXkvtBienBanTinhKhoComponent } from './giua-hai-cuc/xuat-kho-vat-tu/bien-ban-tinh-kho/dcnb-ghc-xkvt-bien-ban-tinh-kho.component';
import { DCNBGHCKtclvtHoSoKyThuatComponent } from './giua-hai-cuc/kiem-tra-chat-luong-vat-tu/ho-so-ky-thuat/dcnb-ghc-ktclvt-ho-so-ky-thuat.component';
import { ChiTietBangKeXuatVatTuDieuChuyenComponent } from './component-chung/bang-ke-xuat-vat-tu/chi-tiet-bang-ke-xuat-vat-tu/chi-tiet-bang-ke-xuat-vat-tu.component';
import { HoSoKyThuatXuatDieuChuyenComponent } from './component-chung/ho-so-ky-thuat/ho-so-ky-thuat.component';
import { ChiTietHoSoKyThuatXuatDieuChuyenComponent } from './component-chung/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component';
import { ChiTietBienBanKiemTraXuatDieuChuyenComponent } from './component-chung/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component';

@NgModule({
  declarations: [
    XuatDieuChuyenComponent,
    DcnbXuatNoiBoChiCucComponent,
    DcnbNbccThayDoiThuKhoComponent,
    DcnbNbccKhongThayDoiThuKhoComponent,
    NbccTdtkXuatKhoLuongThucComponent,
    DcnbNbccTdtkXuatKhoVatTuComponent,
    NbccKtdtkXuatKhoLuongThucComponent,
    NbccKtdtkXuatKhoVatTuComponent,
    NbccTdtkXkltBangKeXuatVatTuComponent,
    NbccTdtkXkltBienBanTinhKhoComponent,
    NbccTdtkXkltPhieuXuatKhoComponent,
    DcnbNbccTdtkXkvtPhieuXuatKhoComponent,
    NbccTdtkKiemTraChatLuongVatTuComponent,
    NbccTdtkKtclvtPhieuKiemNghiemChatLuongComponent,
    NbccTdtkKtclvtHoSoKyThuatComponent,
    NbccTdtkKtclvtBienBanLayMauBanGiaoComponent,
    NbccTdtkKtclltBienBanLayMauBanGiaoComponent,
    NbccTdtkKtclltPhieuKiemNghiemChatLuongComponent,
    NbccTdtkKiemTraChatLuongLuongThucComponent,
    NbccTdtkXkltBangKeCanHangComponent,
    NbccTdtkXkltBienBanHaoDoiComponent,

    NbccTdtkXkvtBangKeXuatVatTuComponent,
    NbccTdtkXkvtBienBanTinhKhoComponent,

    GhccGiuaHaiChiCucComponent,
    //Giua 2 chi cuc => Kiem tra chat luong luong thuc
    GhccKiemTraChatLuongLuongThucComponent,
    GhccKtclltBienBanLayMauBanGiaoComponent,
    GhccKtclltPhieuKiemNghiemChatLuongComponent,
    //Giua 2 chi cuc =>Kiem tra luong thuc vat tu
    GhccKiemTraChatLuongVatTuComponent,
    GhccKtclvtBienBanLayMauBanGiaoComponent,
    GhccKtclvtPhieuKiemNghiemChatLuongComponent,
    GhccKtclvtHoSoKyThuatComponent,
    //Giua 2 chi cuc=>Xuat kho luong thuc
    GhccXuatKhoLuongThucComponent,
    GhccXkltPhieuXuatKhoComponent,
    GhccXkltBangKeCanHangComponent,
    GhccXkltBienBanTinhKhoComponent,
    GhccXkltBienBanHaoDoiComponent,
    //Giua 2 chi cuc =>Xuat kho vat tu
    GhccXuatKhoVatTuComponent,
    GhccXkvtPhieuXuatKhoComponent,
    GhccXkvtBangKeXuatVatTuComponent,
    GhccXkvtBienBanTinhKhoComponent,
    //Giua 2cuc 
    DCNBGiuaHaiCucComponent,
    //Giua 2 cuc => Kiem tra chat luong luong thuc
    DCNBGHCKiemTraChatLuongLuongThucComponent,
    DCNBGHCKtclltBienBanLayMauBanGiaoComponent,
    DCNBGHCKtclltPhieuKiemNghiemChatLuongComponent,
    //Giua 2 cuc =>Kiem tra luong thuc vat tu
    DCNBGHCKiemTraChatLuongVatTuComponent,
    DCNBGHCKtclvtBienBanLayMauBanGiaoComponent,
    DCNBGHCKtclvtPhieuKiemNghiemChatLuongComponent,
    DCNBGHCKtclvtHoSoKyThuatComponent,
    //Giua 2 cuc =>Xuat kho vat tu
    DCNBGHCXuatKhoLuongThucComponent,
    DCNBGHCXkltPhieuXuatKhoComponent,
    DCNBGHCXkltBangKeCanHangComponent,
    DCNBGHCXkltBienBanTinhKhoComponent,
    DCNBGHCXkltBienBanHaoDoiComponent,
    //Giua 2 cuc =>Xuat kho vat tu
    DCNBGHCXuatKhoVatTuComponent,
    DCNBGHCXkvtPhieuXuatKhoComponent,
    DCNBGHCXkvtBangKeXuatVatTuComponent,
    DCNBGHCXkvtBienBanTinhKhoComponent,

    DanhSachBienBanLayMau,
    ChiTietDanhSachBienBanLayMau,
    ThanhPhanThamGiaComponent,
    PhieuKiemNghiemChatLuongXuatDieuChuyenComponent,
    ThemMoiPhieuKiemNghiemChatLuongXuatDieuChuyenComponent,
    HoSoKyThuatXuatDieuChuyenComponent,
    ChiTietHoSoKyThuatXuatDieuChuyenComponent,
    PhieuXuatKhoDCNBComponent,
    ThemMoiPhieuXuatKhoDCNBComponent,
    BangKeCanXuatDieuChuyenComponent,
    ChiTietBangKeCanDieuChuyenComponent,
    BienBanTinhKhoDieuChuyenComponent,
    ThemMoiBienBanTinhKhoDieuChuyenComponent,
    BienBanHaoDoiDieuChuyenComponent,
    ThemMoiBienBanHaoDoiDieuChuyenComponent,
    BangKeXuatVatTuDieuChuyenComponent,
    ChiTietBangKeXuatVatTuDieuChuyenComponent,
    ChiTietBienBanKiemTraXuatDieuChuyenComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    XuatDieuChuyenRoutingModule,
    QuyetDinhDieuChuyenModule
  ],
  exports: [
    XuatDieuChuyenComponent
  ],
  providers: [DatePipe]
})
export class XuatDieuChuyenModule {
}
