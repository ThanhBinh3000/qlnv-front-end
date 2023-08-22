import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DirectivesModule} from "../../../../directives/directives.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzPipesModule} from "ng-zorro-antd/pipes";
import {MainModule} from "../../../../layout/main/main.module";
import {ComponentsModule} from "../../../../components/components.module";
import {CuuTroVienTroModule} from "../../xuat-cuu-tro-vien-tro/xuat-cuu-tro/cuu-tro-vien-tro.module";
import {
  KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent
} from "./kiemtra-chatluong-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  KiemtraChatluongLtTruockhiHethanLuukhoModule
} from "../kiemtra-chatluong-lt-truockhi-hethan-luukho/kiemtra-chatluong-lt-truockhi-hethan-luukho.module";
import {
  ToanBoDsVtTbTrongThoiGianBaoHanhComponent
} from "./toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh/toan-bo-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  TongHopDsVtTbTrongThoiGianBaoHanhComponent
} from "./tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh/tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent
} from "./tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh/chi-tiet-tong-hop-ds-hang-dtqg/chi-tiet-tong-hop-ds-vt-tb-trong-thoi-gian-bao-hanh.component";
import {DieuChuyenNoiBoModule} from "../../../dieu-chuyen-noi-bo/dieu-chuyen-noi-bo.module";
import {
  XuatKhoVtTbTrongThoiGianBaoHanhComponent
} from "./xuat-kho-vt-tb-trong-thoi-gian-bao-hanh/xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  ThongTinXuatKhoVtTbTrongThoiGianBaoHanhComponent
} from "./xuat-kho-vt-tb-trong-thoi-gian-bao-hanh/thong-tin-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh/thong-tin-xuat-kho-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  KiemTraChatLuongVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/kiem-tra-chat-luong-vt-tb.component";
import {
  XkBienBanLayMauBanGiaoMauComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-lay-mau-ban-giao-mau-vt-tb/bien-ban-lay-mau-ban-giao-mau-vt-tb.component";
import {
  ThongTinBienBanLayMauBanGiaoMauVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-lay-mau-ban-giao-mau-vt-tb/thong-tin-bien-ban-lay-mau-ban-giao-mau-vt-tb/thong-tin-bien-ban-lay-mau-ban-giao-mau-vt-tb.component";
import {
  XkVtPhieuKiemDinhChatLuongVtTbComponent,
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/phieu-kiem-dinh-chat-luong/phieu-kiem-dinh-chat-luong-vt-tb.component";
import {
  ThongTinPhieuKiemDinhChatLuongVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/phieu-kiem-dinh-chat-luong/thong-tin-phieu-kiem-dinh-chat-luong/thong-tin-phieu-kiem-dinh-chat-luong-vt-tb.component";
import {
  BaoCaoKetQuaKiemDinhVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bao-cao-ket-qua-kiem-dinh/bao-cao-ket-qua-kiem-dinh-vt-tb.component";
import {
  ThongTinBaoCaoKetQuaKiemDinhVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bao-cao-ket-qua-kiem-dinh/thong-tin-bao-cao-ket-qua-kiem-dinh/thong-tin-bao-cao-ket-qua-kiem-dinh-vt-tb.component";
import {
  QdGiaoNvXuatNhapVtTbTrongThoiGianBaoHanhComponent
} from "./qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh/qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  QdGiaoNhiemVuXuatHangComponent
} from "./qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh/qd-giao-nhiem-vu-xuat-hang/qd-giao-nhiem-vu-xuat-hang.component";
import {
  ThongTinQdGiaoNhiemVuXuatHangComponent
} from "./qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh/qd-giao-nhiem-vu-xuat-hang/thong-tin-qd-giao-nhiem-vu-xuat-hang/thong-tin-qd-giao-nhiem-vu-xuat-hang.component";
import {
  QdGiaoNhiemVuNhapHangComponent
} from "./qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh/qd-giao-nhiem-vu-nhap-hang/qd-giao-nhiem-vu-nhap-hang.component";
import {
  ThongTinQdGiaoNhiemVuNhapHangComponent
} from "./qd-giao-nv-xuat-nhap-vt-tb-trong-thoi-gian-bao-hanh/qd-giao-nhiem-vu-nhap-hang/thong-tin-qd-giao-nhiem-vu-nhap-hang/thong-tin-qd-giao-nhiem-vu-nhap-hang.component";
import {
  NhapKhoVtTbTrongThoiGianBaoHanhComponent
} from "./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh/nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  PhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent
} from "./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh/phieu-nhap-kho/phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  ThongTinPhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent
} from "./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh/phieu-nhap-kho/thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho-vt-tb-trong-thoi-gian-bao-hanh.component";
import {
  BienBanKetThucNhapKhoBaoHanhComponent
} from "./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho-bao-hanh.component";
import {
  ThongTinBienBanKetThucNhapKhoBaoHanhComponent
} from "./nhap-kho-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho-bao-hanh.component";
import {
  QuyetDinhXuatGiamVatTuBaoHanhComponent
} from "./quyet-dinh-xuat-giam-vat-tu-bao-hanh/quyet-dinh-xuat-giam-vat-tu-bao-hanh.component";
import {
  ThongTinQuyetDinhXuatGiamVatTuBaoHanhComponent
} from "./quyet-dinh-xuat-giam-vat-tu-bao-hanh/thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh/thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh.component";
import {
  ThongTinBienBanYeuCauBaoHanhComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-yeu-cau-bao-hanh/thong-tin-quyet-dinh-xuat-giam-vat-tu-bao-hanh/thong-tin-bien-ban-yeu-cau-bao-hanh.component";
import {
  BienBanYeuCauBaoHanhComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/bien-ban-yeu-cau-bao-hanh/bien-ban-yeu-cau-bao-hanh.component";
import {
  ThongTinPhieuKiemTraChatLuongVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/phieu-kiem-tra-chat-luong/thong-tin-phieu-kiem-dinh-chat-luong/thong-tin-phieu-kiem-tra-chat-luong-vt-tb.component";
import {
  XkVtPhieuKiemTraChatLuongVtTbComponent
} from "./kiem-tra-chat-luong-vt-tb-trong-thoi-gian-bao-hanh/phieu-kiem-tra-chat-luong/phieu-kiem-tra-chat-luong-vt-tb.component";
import {BaoCaoKetQuaBaoHanhComponent} from "./bao-cao-ket-qua-bao-hanh/bao-cao-ket-qua-bao-hanh.component";
import {
  ThongTinBaoCaoKetQuaBaoHanhComponent
} from "./bao-cao-ket-qua-bao-hanh/thong-tin-bao-cao-ket-qua-bao-hanh/thong-tin-bao-cao-ket-qua-bao-hanh.component";


@NgModule({
  declarations: [
    KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent,
    ToanBoDsVtTbTrongThoiGianBaoHanhComponent,
    TongHopDsVtTbTrongThoiGianBaoHanhComponent,
    ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNvXuatNhapVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNhiemVuXuatHangComponent,
    ThongTinQdGiaoNhiemVuXuatHangComponent,
    QdGiaoNhiemVuNhapHangComponent,
    ThongTinQdGiaoNhiemVuNhapHangComponent,
    XuatKhoVtTbTrongThoiGianBaoHanhComponent,
    ThongTinXuatKhoVtTbTrongThoiGianBaoHanhComponent,
    KiemTraChatLuongVtTbComponent,
    XkBienBanLayMauBanGiaoMauComponent,
    ThongTinBienBanLayMauBanGiaoMauVtTbComponent,
    XkVtPhieuKiemDinhChatLuongVtTbComponent,
    ThongTinPhieuKiemDinhChatLuongVtTbComponent,
    BaoCaoKetQuaKiemDinhVtTbComponent,
    ThongTinBaoCaoKetQuaKiemDinhVtTbComponent,
    NhapKhoVtTbTrongThoiGianBaoHanhComponent,
    PhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent,
    ThongTinPhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent,
    BienBanKetThucNhapKhoBaoHanhComponent,
    ThongTinBienBanKetThucNhapKhoBaoHanhComponent,
    QuyetDinhXuatGiamVatTuBaoHanhComponent,
    ThongTinQuyetDinhXuatGiamVatTuBaoHanhComponent,
    BienBanYeuCauBaoHanhComponent,
    ThongTinBienBanYeuCauBaoHanhComponent,
    XkVtPhieuKiemTraChatLuongVtTbComponent,
    ThongTinPhieuKiemTraChatLuongVtTbComponent,
    BaoCaoKetQuaBaoHanhComponent,
    ThongTinBaoCaoKetQuaBaoHanhComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    CuuTroVienTroModule,
    KiemtraChatluongLtTruockhiHethanLuukhoModule,
    DieuChuyenNoiBoModule,
  ],
  exports: [
    KiemtraChatluongVtTbTrongThoiGianBaoHanhComponent,
    ToanBoDsVtTbTrongThoiGianBaoHanhComponent,
    TongHopDsVtTbTrongThoiGianBaoHanhComponent,
    ChiTietTongHopDsVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNvXuatNhapVtTbTrongThoiGianBaoHanhComponent,
    QdGiaoNhiemVuXuatHangComponent,
    ThongTinQdGiaoNhiemVuXuatHangComponent,
    QdGiaoNhiemVuNhapHangComponent,
    ThongTinQdGiaoNhiemVuNhapHangComponent,
    XuatKhoVtTbTrongThoiGianBaoHanhComponent,
    ThongTinXuatKhoVtTbTrongThoiGianBaoHanhComponent,
    KiemTraChatLuongVtTbComponent,
    XkBienBanLayMauBanGiaoMauComponent,
    ThongTinBienBanLayMauBanGiaoMauVtTbComponent,
    XkVtPhieuKiemDinhChatLuongVtTbComponent,
    ThongTinPhieuKiemDinhChatLuongVtTbComponent,
    BaoCaoKetQuaKiemDinhVtTbComponent,
    ThongTinBaoCaoKetQuaKiemDinhVtTbComponent,
    NhapKhoVtTbTrongThoiGianBaoHanhComponent,
    PhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent,
    ThongTinPhieuNhapKhoVtTbTrongThoiGianBaoHanhComponent,
    BienBanKetThucNhapKhoBaoHanhComponent,
    ThongTinBienBanKetThucNhapKhoBaoHanhComponent,
    QuyetDinhXuatGiamVatTuBaoHanhComponent,
    ThongTinQuyetDinhXuatGiamVatTuBaoHanhComponent,
    BienBanYeuCauBaoHanhComponent,
    ThongTinBienBanYeuCauBaoHanhComponent,
    XkVtPhieuKiemTraChatLuongVtTbComponent,
    ThongTinPhieuKiemTraChatLuongVtTbComponent,
    BaoCaoKetQuaBaoHanhComponent,
    ThongTinBaoCaoKetQuaBaoHanhComponent
  ],
  providers: [DatePipe]
})
export class KiemtraChatluongVtTbTrongThbhComponentModule {
}
