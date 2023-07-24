import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToanBoDanhSachVt6ThComponent } from './toan-bo-danh-sach-vt6th/toan-bo-danh-sach-vt6th.component';
import { QuyetDinhGiaoNhiemVuXuatHangComponent } from './quyet-dinh-giao-nhiem-vu-xuat-hang/quyet-dinh-giao-nhiem-vu-xuat-hang.component';
import { QuyetDinhXuatGiamVatTuComponent } from './quyet-dinh-xuat-giam-vat-tu/quyet-dinh-xuat-giam-vat-tu.component';
import { KiemTraChatLuongComponent } from './kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { XuatKhoComponent } from './xuat-kho/xuat-kho.component';
import { NhapKhoComponent } from './nhap-kho/nhap-kho.component';
import {DirectivesModule} from "../../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../../components/components.module";
import { TongHopDanhSachVt6thComponent } from './tong-hop-danh-sach-vt6th/tong-hop-danh-sach-vt6th.component';
import { ChiTietTongHopDanhSachVt6thComponent } from './tong-hop-danh-sach-vt6th/chi-tiet-tong-hop-danh-sach-vt6th/chi-tiet-tong-hop-danh-sach-vt6th.component';
import {
    VtTbCoThoihanLuukhoLonHonMuoihaiThangModule
} from "../vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang/vt-tb-co-thoihan-luukho-lon-hon-muoihai-thang.module";
import { ThongTinQuyetDinhGiaoNhiemVuXuatHangComponent } from './quyet-dinh-giao-nhiem-vu-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-xuat-hang/thong-tin-quyet-dinh-giao-nhiem-vu-xuat-hang.component';
import {
  XkBienBanLayMauBanGiaoMauComponent
} from './kiem-tra-chat-luong/bien-ban-lay-mau-ban-giao-mau/bien-ban-lay-mau-ban-giao-mau.component';
import { XkVtPhieuKiemNghiemChatLuongComponent } from './kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/phieu-kiem-nghiem-chat-luong.component';
import { BaoCaoKetQuaKiemDinhComponent } from './kiem-tra-chat-luong/bao-cao-ket-qua-kiem-dinh/bao-cao-ket-qua-kiem-dinh.component';
import { ThongTinPhieuXuatKhoComponent } from './xuat-kho/thong-tin-phieu-xuat-kho/thong-tin-phieu-xuat-kho.component';
import { ThongTinBienBanLayMauBanGiaoMauComponent } from './kiem-tra-chat-luong/bien-ban-lay-mau-ban-giao-mau/thong-tin-bien-ban-lay-mau-ban-giao-mau/thong-tin-bien-ban-lay-mau-ban-giao-mau.component';
import { ThongTinPhieuKiemNghiemChatLuongComponent } from './kiem-tra-chat-luong/phieu-kiem-nghiem-chat-luong/thong-tin-phieu-kiem-nghiem-chat-luong/thong-tin-phieu-kiem-nghiem-chat-luong.component';
import { ThongTinBaoCaoKetQuaKiemDinhComponent } from './kiem-tra-chat-luong/bao-cao-ket-qua-kiem-dinh/thong-tin-bao-cao-ket-qua-kiem-dinh/thong-tin-bao-cao-ket-qua-kiem-dinh.component';
import {CuuTroVienTroModule} from "../../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import { PhieuNhapKhoComponent } from './nhap-kho/phieu-nhap-kho/phieu-nhap-kho.component';
import { ThongTinPhieuNhapKhoComponent } from './nhap-kho/phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { BienBanKetThucNhapKhoComponent } from './nhap-kho/bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './nhap-kho/bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho.component';



@NgModule({
  declarations: [
    ToanBoDanhSachVt6ThComponent,
    QuyetDinhGiaoNhiemVuXuatHangComponent,
    QuyetDinhXuatGiamVatTuComponent,
    KiemTraChatLuongComponent,
    XuatKhoComponent,
    NhapKhoComponent,
    TongHopDanhSachVt6thComponent,
    ChiTietTongHopDanhSachVt6thComponent,
    ThongTinQuyetDinhGiaoNhiemVuXuatHangComponent,
    XkBienBanLayMauBanGiaoMauComponent,
    XkVtPhieuKiemNghiemChatLuongComponent,
    BaoCaoKetQuaKiemDinhComponent,
    ThongTinPhieuXuatKhoComponent,
    ThongTinBienBanLayMauBanGiaoMauComponent,
    ThongTinPhieuKiemNghiemChatLuongComponent,
    ThongTinBaoCaoKetQuaKiemDinhComponent,
    PhieuNhapKhoComponent,
    ThongTinPhieuNhapKhoComponent,
    BienBanKetThucNhapKhoComponent,
    ThongTinBienBanKetThucNhapKhoComponent,
  ],
    exports: [
        ToanBoDanhSachVt6ThComponent,
        TongHopDanhSachVt6thComponent,
        QuyetDinhXuatGiamVatTuComponent,
        QuyetDinhGiaoNhiemVuXuatHangComponent,
        KiemTraChatLuongComponent,
        XuatKhoComponent,
        NhapKhoComponent
    ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    VtTbCoThoihanLuukhoLonHonMuoihaiThangModule,
    CuuTroVienTroModule,
  ]
})
export class VtTbCoThoihanLuukhoConSauThangModule { }
