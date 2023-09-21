import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { XuatThanhLyRoutingModule } from './xuat-thanh-ly-routing.module';
import { ComponentsModule } from "../../../components/components.module";
import { DirectivesModule } from "../../../directives/directives.module";
import { ThanhLyDanhSachHangComponent } from "./thanh-ly-danh-sach-hang/thanh-ly-danh-sach-hang.component";
import { XuatThanhLyComponent } from "./xuat-thanh-ly.component";
import { NzStatisticModule } from "ng-zorro-antd/statistic";
import { NzPipesModule } from "ng-zorro-antd/pipes";
import { MainModule } from "../../../layout/main/main.module";
import { QuyetDinhThanhLyComponent } from './quyet-dinh-thanh-ly/quyet-dinh-thanh-ly.component';
import {
  ThemMoiQuyetDinhThanhLyComponent
} from './quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly/them-moi-quyet-dinh-thanh-ly.component';
import { BaoCaoKetQuaThanhLyComponent } from "./bao-cao-ket-qua/bao-cao-ket-qua-thanh-ly.component";
import {
  ThemMoiBaoCaoKetQuaThanhLyComponent
} from "./bao-cao-ket-qua/them-moi-bao-ket-qua-thanh-ly/them-moi-bao-cao-ket-qua-thanh-ly.component";
import { TongHopThanhLyComponent } from './tong-hop-thanh-ly/tong-hop-thanh-ly.component';
import { ThongBaoKetQuaComponent } from "./thong-bao-ket-qua/thong-bao-ket-qua.component";
import {
  ThemMoiThongBaoKetQuaComponent
} from "./thong-bao-ket-qua/them-moi-thong-bao-ket-qua/them-moi-thong-bao-ket-qua.component";
import { HoSoThanhLyComponent } from './ho-so-thanh-ly/ho-so-thanh-ly.component';
import { ChiTietHoSoThanhLyComponent } from './ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly/chi-tiet-ho-so-thanh-ly.component';
import { ToChucThucHienThanhLyComponent } from './to-chuc-thuc-hien-thanh-ly/to-chuc-thuc-hien-thanh-ly.component';
import {
  ThongTinDauGiaThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly.component';
import {
  QuyetDinhPheDuyetKqBdgThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly.component';
import {
  ChiTietThongTinDauGiaThanhLyComponent
} from "./to-chuc-thuc-hien-thanh-ly/thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly.component";
import {
  ThongTinChiTietDauGiaThanhLyComponent
} from "./to-chuc-thuc-hien-thanh-ly/thong-tin-dau-gia-thanh-ly/chi-tiet-thong-tin-dau-gia-thanh-ly/thong-tin-dau-gia-thanh-ly/thong-tin-chi-tiet-dau-gia-thanh-ly.component";
import { HopDongThanhLyComponent } from './to-chuc-thuc-hien-thanh-ly/hop-dong-thanh-ly/hop-dong-thanh-ly.component';
import {
  ChiTietQuyetDinhPheDuyetBdgThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/quyet-dinh-phe-duyet-kq-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly/chi-tiet-quyet-dinh-phe-duyet-bdg-thanh-ly.component';
import { HopDongModule } from "../dau-gia/hop-dong/hop-dong.module";
import {
  QuanLyHopDongThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly/quan-ly-hop-dong-thanh-ly.component';
import {
  ThongTinHopDongThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly/thong-tin-hop-dong-thanh-ly.component';
import {
  QuyetDinhGiaoNhiemVuThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly.component';
import {
  ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent
} from './to-chuc-thuc-hien-thanh-ly/quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly/chi-tiet-quyet-dinh-giao-nhiem-vu-thanh-ly.component';
import { ThucHienXuatThanhLyComponent } from './thuc-hien-xuat-thanh-ly/thuc-hien-xuat-thanh-ly.component';
import { KiemTraChatLuongComponent } from './thuc-hien-xuat-thanh-ly/kiem-tra-chat-luong/kiem-tra-chat-luong.component';
import { XuatKhoComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/xuat-kho.component';
import { XuatModule } from "src/app/pages/xuat/xuat.module";
import { PhieuXuatKhoThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/phieu-xuat-kho-thanh-ly/phieu-xuat-kho-thanh-ly.component';
import { ChiTietPhieuXuatKhoThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/phieu-xuat-kho-thanh-ly/chi-tiet-phieu-xuat-kho-thanh-ly/chi-tiet-phieu-xuat-kho-thanh-ly.component';
import { BangKeCanThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bang-ke-can-thanh-ly/bang-ke-can-thanh-ly.component';
import { ChiTietBangKeCanThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bang-ke-can-thanh-ly/chi-tiet-bang-ke-can-thanh-ly/chi-tiet-bang-ke-can-thanh-ly.component';
import { BienBanTinhKhoThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bien-ban-tinh-kho-thanh-ly/bien-ban-tinh-kho-thanh-ly.component';
import { ChiTietBbTinhKhoThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bien-ban-tinh-kho-thanh-ly/chi-tiet-bb-tinh-kho-thanh-ly/chi-tiet-bb-tinh-kho-thanh-ly.component';
import { BienBanHaoDoiThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bien-ban-hao-doi-thanh-ly/bien-ban-hao-doi-thanh-ly.component';
import { ChiTietBbHaoDoiThanhLyComponent } from './thuc-hien-xuat-thanh-ly/xuat-kho/bien-ban-hao-doi-thanh-ly/chi-tiet-bb-hao-doi-thanh-ly/chi-tiet-bb-hao-doi-thanh-ly.component';
import {
  HoSoKyThuatComponent
} from "src/app/pages/xuat/xuat-thanh-ly/thuc-hien-xuat-thanh-ly/kiem-tra-chat-luong/ho-so-ky-thuat/ho-so-ky-thuat.component";
import {
  ChiTietHoSoKyThuatComponent
} from "src/app/pages/xuat/xuat-thanh-ly/thuc-hien-xuat-thanh-ly/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import {
  ChiTietBienBanKiemTraComponent
} from "src/app/pages/xuat/xuat-thanh-ly/thuc-hien-xuat-thanh-ly/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component";
import { DauGiaModule } from "../dau-gia/dau-gia.module";
import { ThemmoiThComponent } from './tong-hop-thanh-ly/themmoi-th/themmoi-th.component';
import { ChitietThComponent } from './tong-hop-thanh-ly/chitiet-th/chitiet-th.component';


@NgModule({
  declarations: [
    XuatThanhLyComponent,
    ThanhLyDanhSachHangComponent,
    QuyetDinhThanhLyComponent,
    ThemMoiQuyetDinhThanhLyComponent,
    BaoCaoKetQuaThanhLyComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    TongHopThanhLyComponent,
    ThemmoiThComponent,
    ChitietThComponent,
    ThemMoiBaoCaoKetQuaThanhLyComponent,
    ThongBaoKetQuaComponent,
    ThemMoiThongBaoKetQuaComponent,
    HoSoThanhLyComponent,
    ChiTietHoSoThanhLyComponent,
    ToChucThucHienThanhLyComponent,
    ThongTinDauGiaThanhLyComponent,
    QuyetDinhPheDuyetKqBdgThanhLyComponent,
    ChiTietThongTinDauGiaThanhLyComponent,
    ThongTinChiTietDauGiaThanhLyComponent,
    HopDongThanhLyComponent,

    QuyetDinhPheDuyetKqBdgThanhLyComponent,
    ChiTietQuyetDinhPheDuyetBdgThanhLyComponent,
    QuanLyHopDongThanhLyComponent,
    ThongTinHopDongThanhLyComponent,
    QuyetDinhGiaoNhiemVuThanhLyComponent,
    ChiTietQuyetDinhGiaoNhiemVuThanhLyComponent,
    ThucHienXuatThanhLyComponent,
    KiemTraChatLuongComponent,
    XuatKhoComponent,
    PhieuXuatKhoThanhLyComponent,
    ChiTietPhieuXuatKhoThanhLyComponent,
    BangKeCanThanhLyComponent,
    ChiTietBangKeCanThanhLyComponent,
    BienBanTinhKhoThanhLyComponent,
    ChiTietBbTinhKhoThanhLyComponent,
    BienBanHaoDoiThanhLyComponent,
    ChiTietBbHaoDoiThanhLyComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent
  ],
  imports: [
    CommonModule,
    XuatThanhLyRoutingModule,
    DirectivesModule,
    NzStatisticModule,
    NzPipesModule,
    MainModule,
    ComponentsModule,
    HopDongModule,
    XuatModule,
    DauGiaModule,
  ],
  exports: [
    ThanhLyDanhSachHangComponent
  ],
  providers: [DatePipe]
})
export class XuatThanhLyModule {
}

