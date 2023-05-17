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
  NbccTdtkXkltBangKeNhapVatTuComponent
} from "./noi-bo-chi-cuc/thay-doi-thu-kho/xuat-kho-luong-thuc/bang-ke-nhap-vat-tu/nbcc-tdtk-xklt-bang-ke-nhap-vat-tu.component";
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
import { HoSoKyThuatXuatDieuChuyenComponent } from './component-chung/ho-so-ky-thuat/ho-so-ky-thuat.component';
import { ChiTietHoSoKyThuatXuatDieuChuyenComponent } from './component-chung/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component';
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
    NbccTdtkXkltBangKeNhapVatTuComponent,
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

    GhccGiuaHaiChiCucComponent,
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
    ThemMoiBienBanHaoDoiDieuChuyenComponent
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
