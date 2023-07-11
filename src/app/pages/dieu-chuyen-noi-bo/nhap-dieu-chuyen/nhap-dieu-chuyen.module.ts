import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from "../../../components/components.module";
import { MainModule } from "../../../layout/main/main.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { NzCardModule } from "ng-zorro-antd/card";

import { NhapDieuChuyenComponent } from './nhap-dieu-chuyen.component';
import { NhapDieuChuyenRoutingModule } from './nhap-dieu-chuyen-routing.module';
import { NoiBoChiCucComponent } from './tablevel1/noi-bo-chi-cuc/noi-bo-chi-cuc.component';
import { GiuaHaiChiCucComponent } from './tablevel1/giua-hai-chi-cuc/giua-hai-chi-cuc.component';
import { GiuaHaiCucComponent } from './tablevel1/giua-hai-cuc/giua-hai-cuc.component';
import { ChatLuongLuongThucComponent } from './tablevel2/chat-luong-luong-thuc/chat-luong-luong-thuc.component';
import { ChatLuongVatTuComponent } from './tablevel2/chat-luong-vat-tu/chat-luong-vat-tu.component';
import { NhapKhoVatTuComponent } from './tablevel2/nhap-kho-vat-tu/nhap-kho-vat-tu.component';
import { NhapKhoLuongThucComponent } from './tablevel2/nhap-kho-luong-thuc/nhap-kho-luong-thuc.component';
import { BienBanMauComponent } from './tablevel3/bien-ban-lay-mau-ban-giao-mau/bien-ban-mau/bien-ban-mau.component';
import { KiemNghiemChatLuongComponent } from './tablevel3/phieu-kiem-nghiem-chat-luong/kiem-nghiem-chat-luong/kiem-nghiem-chat-luong.component';
import { HoSoKyThuatComponent } from './tablevel3/ho-so-ky-thuat/ho-so-ky-thuat/ho-so-ky-thuat.component';
import { PhieuNhapKhoComponent } from './tablevel3/phieu-nhap-kho/phieu-nhap-kho/phieu-nhap-kho.component';
import { BangKeCanHangComponent } from './tablevel3/bang-ke-can-hang/bang-ke-can-hang/bang-ke-can-hang.component';
import { BienBanNhapDayDuComponent } from './tablevel3/bien-ban-nhap-day-du/bien-ban-nhap-day-du/bien-ban-nhap-day-du.component';
import { BienBanGiaoNhanComponent } from './tablevel3/bien-ban-giao-nhan/bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { BangKeNhapVatTuComponent } from './tablevel3/bang-ke-nhap-vat-tu/bang-ke-nhap-vat-tu/bang-ke-nhap-vat-tu.component';
import { KiemTraChatLuongComponent } from './tablevel3/phieu-kiem-tra-chat-luong/kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { BienBanNghiemThuBaoQuanLanDauComponent } from './tablevel3/bien-ban-nghiem-thu-bao-quan-lan-dau/bien-ban-nghiem-thu-bao-quan-lan-dau/bien-ban-nghiem-thu-bao-quan-lan-dau.component';
import { ThongTinBienBanNghiemThuBaoQuanLanDauComponent } from './tablevel3/bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-bien-ban-nghiem-thu-bao-quan-lan-dau.component';
import { ThongTinHangDtqgComponent } from './tablevel3/bien-ban-nghiem-thu-bao-quan-lan-dau/thong-tin-hang-dtqg/thong-tin-hang-dtqg.component';
import { ThongTinKiemNghiemChatLuongComponent } from './tablevel3/phieu-kiem-nghiem-chat-luong/thong-tin-kiem-nghiem-chat-luong/thong-tin-kiem-nghiem-chat-luong.component';
import { ThongTinKiemTraChatLuongComponent } from './tablevel3/phieu-kiem-tra-chat-luong/thong-tin-kiem-tra-chat-luong/thong-tin-kiem-tra-chat-luong.component';
import { ThongTinBienBanLayMauBanGiaoMauComponent } from './tablevel3/bien-ban-lay-mau-ban-giao-mau/thong-tin-bien-ban-lay-mau-ban-giao-mau/thong-tin-bien-ban-lay-mau-ban-giao-mau.component';
import { BienBanChuanBiKhoComponent } from './tablevel3/bien-ban-chuan-bi-kho/bien-ban-chuan-bi-kho/bien-ban-chuan-bi-kho.component';
import { BienBanKetThucNhapKhoComponent } from './tablevel3/bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinBienBanChuanBiKhoComponent } from './tablevel3/bien-ban-chuan-bi-kho/thong-tin-bien-ban-chuan-bi-kho/thong-tin-bien-ban-chuan-bi-kho.component';
import { ThongTinBienBanNhapDayDuComponent } from './tablevel3/bien-ban-nhap-day-du/thong-tin-bien-ban-nhap-day-du/thong-tin-bien-ban-nhap-day-du.component';
import { DauGiaModule } from "../../xuat/dau-gia/dau-gia.module";
import { ThongTinHoSoKyThuatComponent } from './tablevel3/ho-so-ky-thuat/thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { ThongTinPhieuNhapKhoComponent } from './tablevel3/phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThongTinBangKeCanHangComponent } from './tablevel3/bang-ke-can-hang/thong-tin-bang-ke-can-hang/thong-tin-bang-ke-can-hang.component';
import { ThongTinBangKeNhapVatTuComponent } from './tablevel3/bang-ke-nhap-vat-tu/thong-tin-bang-ke-nhap-vat-tu/thong-tin-bang-ke-nhap-vat-tu.component';
import { ThongTinBienBanGiaoNhanComponent } from './tablevel3/bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './tablevel3/bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho.component';



@NgModule({
  declarations: [
    NhapDieuChuyenComponent,
    NoiBoChiCucComponent,
    GiuaHaiChiCucComponent,
    GiuaHaiCucComponent,
    ChatLuongLuongThucComponent,
    ChatLuongVatTuComponent,
    NhapKhoVatTuComponent,
    NhapKhoLuongThucComponent,
    BienBanMauComponent,
    KiemNghiemChatLuongComponent,
    HoSoKyThuatComponent,
    PhieuNhapKhoComponent,
    BangKeCanHangComponent,
    BienBanNhapDayDuComponent,
    BienBanGiaoNhanComponent,
    BangKeNhapVatTuComponent,
    KiemTraChatLuongComponent,
    BienBanNghiemThuBaoQuanLanDauComponent,
    ThongTinBienBanNghiemThuBaoQuanLanDauComponent,
    ThongTinHangDtqgComponent,
    ThongTinKiemNghiemChatLuongComponent,
    ThongTinKiemTraChatLuongComponent,
    ThongTinBienBanLayMauBanGiaoMauComponent,
    BienBanChuanBiKhoComponent,
    BienBanKetThucNhapKhoComponent,
    ThongTinBienBanChuanBiKhoComponent,
    ThongTinBienBanNhapDayDuComponent,
    ThongTinHoSoKyThuatComponent,
    ThongTinPhieuNhapKhoComponent,
    ThongTinBangKeCanHangComponent,
    ThongTinBangKeNhapVatTuComponent,
    ThongTinBienBanGiaoNhanComponent,
    ThongTinBienBanKetThucNhapKhoComponent
  ],
  exports: [
    KiemTraChatLuongComponent
  ],
  imports: [
    CommonModule,
    NhapDieuChuyenRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    NzCardModule,
    MainModule,
    ComponentsModule,
    DauGiaModule
  ]
})
export class NhapDieuChuyenModule { }
