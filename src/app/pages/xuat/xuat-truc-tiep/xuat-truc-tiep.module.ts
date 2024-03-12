import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {XuatTrucTiepComponent} from './xuat-truc-tiep.component';
import {XuatTrucTiepRoutingModule} from './xuat-truc-tiep-routing.module';
import {KeHoachBanTrucTiepComponent} from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.component';
import {KeHoachBanTrucTiepModule} from './ke-hoach-ban-truc-tiep/ke-hoach-ban-truc-tiep.module';
import {
  ToChucTrienKhaiBanTrucTiepComponent
} from './to-chuc-trien-khai-ban-truc-tiep/to-chuc-trien-khai-ban-truc-tiep.component';
import {
  ToChucTrienKhaiBanTrucTiepModule
} from './to-chuc-trien-khai-ban-truc-tiep/to-chuc-trien-khai-ban-truc-tiep.module';
import {HopDongBttModule} from './hop-dong-btt/hop-dong-btt.module';
import {GiaoNvXuatHangBttModule} from './giao-nv-xuat-hang-btt/giao-nv-xuat-hang-btt.module';
import {KiemTraCluongBttModule} from './kiem-tra-cluong-btt/kiem-tra-cluong-btt.module';
import {XuatKhoBttModule} from './xuat-kho-btt/xuat-kho-btt.module';
import {QuyetDinhUyquenBanleBttModule} from './quyet-dinh-uyquen-banle-btt/quyet-dinh-uyquen-banle-btt.module';
import {QuyetDinhChaogiaBttModule} from "./quyet-dinh-chaogia-btt/quyet-dinh-chaogia-btt.module";
import {XuatKhoBttComponent} from "./xuat-kho-btt/xuat-kho-btt.component";
import {MainXuatKhoBttComponent} from "./xuat-kho-btt/main-xuat-kho-btt/main-xuat-kho-btt.component";
import {PhieuXuatKhoBttComponent} from "./xuat-kho-btt/phieu-xuat-kho-btt/phieu-xuat-kho-btt.component";
import {
  ThemMoiPhieuXuatKhoBttComponent
} from "./xuat-kho-btt/phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt/them-moi-phieu-xuat-kho-btt.component";
import {BangCanKeHangBttComponent} from "./xuat-kho-btt/bang-can-ke-hang-btt/bang-can-ke-hang-btt.component";
import {
  ThemMoiBangKeCanHangBttComponent
} from "./xuat-kho-btt/bang-can-ke-hang-btt/them-moi-bang-ke-can-hang-btt/them-moi-bang-ke-can-hang-btt.component";
import {BienBanTinhKhoBttComponent} from "./xuat-kho-btt/bien-ban-tinh-kho-btt/bien-ban-tinh-kho-btt.component";
import {
  ThemMoiBienBanTinhKhoComponent
} from "./xuat-kho-btt/bien-ban-tinh-kho-btt/them-moi-bien-ban-tinh-kho/them-moi-bien-ban-tinh-kho.component";
import {BienBanHaoDoiBttComponent} from "./xuat-kho-btt/bien-ban-hao-doi-btt/bien-ban-hao-doi-btt.component";
import {
  ThemMoiBienBanHaoDoiBttComponent
} from "./xuat-kho-btt/bien-ban-hao-doi-btt/them-moi-bien-ban-hao-doi-btt/them-moi-bien-ban-hao-doi-btt.component";
import {KiemTraCluongBttComponent} from "./kiem-tra-cluong-btt/kiem-tra-cluong-btt.component";
import {MainKtraCluongBttComponent} from "./kiem-tra-cluong-btt/main-ktra-cluong-btt/main-ktra-cluong-btt.component";
import {BienBanLayMauBttComponent} from "./kiem-tra-cluong-btt/bien-ban-lay-mau-btt/bien-ban-lay-mau-btt.component";
import {
  ThemMoiBienBanLayMauBttComponent
} from "./kiem-tra-cluong-btt/bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt.component";
import {
  ThemDaiDienComponent
} from "./kiem-tra-cluong-btt/bien-ban-lay-mau-btt/them-moi-bien-ban-lay-mau-btt/them-dai-dien/them-dai-dien.component";
import {PhieuKtraCluongBttComponent} from "./kiem-tra-cluong-btt/phieu-ktra-cluong-btt/phieu-ktra-cluong-btt.component";
import {
  ThemPhieuKtraCluongBttComponent
} from "./kiem-tra-cluong-btt/phieu-ktra-cluong-btt/them-phieu-ktra-cluong-btt/them-phieu-ktra-cluong-btt.component";
import {HoSoKyThuatComponent} from "./kiem-tra-cluong-btt/ho-so-ky-thuat-btt/ho-so-ky-thuat.component";
import {
  ChiTietHoSoKyThuatComponent
} from "./kiem-tra-cluong-btt/ho-so-ky-thuat-btt/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import {
  ChiTietBienBanKiemTraComponent
} from "./kiem-tra-cluong-btt/ho-so-ky-thuat-btt/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component";
import {GiaoNvXuatHangBttComponent} from "./giao-nv-xuat-hang-btt/giao-nv-xuat-hang-btt.component";
import {QdGiaoNvXuatBttComponent} from "./giao-nv-xuat-hang-btt/qd-giao-nv-xuat-btt/qd-giao-nv-xuat-btt.component";
import {
  ThemMoiQdGiaoNvXuatBttComponent
} from "./giao-nv-xuat-hang-btt/qd-giao-nv-xuat-btt/them-moi-qd-giao-nv-xuat-btt/them-moi-qd-giao-nv-xuat-btt.component";
import {HopDongBttComponent} from "./hop-dong-btt/hop-dong-btt.component";
import {MainHopDongBttComponent} from "./hop-dong-btt/main-hop-dong-btt/main-hop-dong-btt.component";
import {DanhSachHopDongBttComponent} from "./hop-dong-btt/danh-sach-hop-dong-btt/danh-sach-hop-dong-btt.component";
import {
  DanhSachBanTrucTiepChiCucComponent
} from "./hop-dong-btt/danh-sach-hop-dong-btt/danh-sach-ban-truc-tiep-chi-cuc/danh-sach-ban-truc-tiep-chi-cuc.component";
import {
  QuanLyHopDongBttComponent
} from "./hop-dong-btt/danh-sach-hop-dong-btt/quan-ly-hop-dong-btt/quan-ly-hop-dong-btt.component";
import {
  ThongTinHopDongBttComponent
} from "./hop-dong-btt/danh-sach-hop-dong-btt/thong-tin-hop-dong-btt/thong-tin-hop-dong-btt.component";
import {PhuLucBttComponent} from "./hop-dong-btt/danh-sach-hop-dong-btt/phu-luc-btt/phu-luc-btt.component";
import {BangKeBanHangComponent} from "./hop-dong-btt/bang-ke-ban-hang/bang-ke-ban-hang.component";
import {QuyetDinhChaoGiaComponent} from "./quyet-dinh-chaogia-btt/quyet-dinh-chao-gia/quyet-dinh-chao-gia.component";
import {
  ChiTietQuyetDinhChaoGiaComponent
} from "./quyet-dinh-chaogia-btt/quyet-dinh-chao-gia/chi-tiet-quyet-dinh-chao-gia/chi-tiet-quyet-dinh-chao-gia.component";
import {QuyetDinhUyquenBanleBttComponent} from "./quyet-dinh-uyquen-banle-btt/quyet-dinh-uyquen-banle-btt.component";
import {
  QuyetDinhUyQuenBanLeComponent
} from "./quyet-dinh-uyquen-banle-btt/quyet-dinh-uy-quen-ban-le/quyet-dinh-uy-quen-ban-le.component";
import {
  ThongTinQuyetDinhUyQuyenBanLeComponent
} from "./quyet-dinh-uyquen-banle-btt/quyet-dinh-uy-quen-ban-le/thong-tin-quyet-dinh-uy-quyen-ban-le/thong-tin-quyet-dinh-uy-quyen-ban-le.component";
import {
  MainTochucTrienkhiBantructiepComponent
} from "./to-chuc-trien-khai-ban-truc-tiep/main-tochuc-trienkhi-bantructiep/main-tochuc-trienkhi-bantructiep.component";
import {
  ThongTinBanTrucTiepComponent
} from "./to-chuc-trien-khai-ban-truc-tiep/thong-tin-ban-truc-tiep/thong-tin-ban-truc-tiep.component";
import {
  ThemMoiThongTinBanTrucTiepComponent
} from "./to-chuc-trien-khai-ban-truc-tiep/thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep/them-moi-thong-tin-ban-truc-tiep.component";
import {
  MainKeHoachBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/main-ke-hoach-ban-truc-tiep/main-ke-hoach-ban-truc-tiep.component";
import {
  DeXuatKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/de-xuat-kh-ban-truc-tiep/de-xuat-kh-ban-truc-tiep.component";
import {
  ThemMoiDeXuatKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep/them-moi-de-xuat-kh-ban-truc-tiep.component";
import {
  TongHopKeHoachBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/tong-hop-ke-hoach-ban-truc-tiep/tong-hop-ke-hoach-ban-truc-tiep.component";
import {
  ThemMoiTongHopKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/tong-hop-ke-hoach-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep/them-moi-tong-hop-kh-ban-truc-tiep.component";
import {
  QuyetDinhPheDuyetKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/quyet-dinh-phe-duyet-kh-ban-truc-tiep/quyet-dinh-phe-duyet-kh-ban-truc-tiep.component";
import {
  ThemMoiQdPheDuyetKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/quyet-dinh-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep.component";
import {
  ThongTinKhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/quyet-dinh-phe-duyet-kh-ban-truc-tiep/them-moi-qd-phe-duyet-kh-ban-truc-tiep/thong-tin-kh-ban-truc-tiep/thong-tin-kh-ban-truc-tiep.component";
import {
  DieuChinhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/dieu-chinh-ban-truc-tiep/dieu-chinh-ban-truc-tiep.component";
import {
  ChiTietDieuChinhBanTrucTiepComponent
} from "./ke-hoach-ban-truc-tiep/dieu-chinh-ban-truc-tiep/chi-tiet-dieu-chinh-ban-truc-tiep/chi-tiet-dieu-chinh-ban-truc-tiep.component";
import {
  ThongTinChiTietDieuChinhComponent
} from "./ke-hoach-ban-truc-tiep/dieu-chinh-ban-truc-tiep/chi-tiet-dieu-chinh-ban-truc-tiep/thong-tin-chi-tiet-dieu-chinh/thong-tin-chi-tiet-dieu-chinh.component";
import {QuyetDinhChaogiaBttComponent} from "./quyet-dinh-chaogia-btt/quyet-dinh-chaogia-btt.component";
import {
  KeHoachVonDauNamModule
} from "../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import {DauGiaModule} from "../dau-gia/dau-gia.module";

@NgModule({
  declarations: [
    XuatTrucTiepComponent,
    KeHoachBanTrucTiepComponent,
    MainKeHoachBanTrucTiepComponent,
    DeXuatKhBanTrucTiepComponent,
    ThemMoiDeXuatKhBanTrucTiepComponent,
    TongHopKeHoachBanTrucTiepComponent,
    ThemMoiTongHopKhBanTrucTiepComponent,
    QuyetDinhPheDuyetKhBanTrucTiepComponent,
    ThemMoiQdPheDuyetKhBanTrucTiepComponent,
    ThongTinKhBanTrucTiepComponent,
    DieuChinhBanTrucTiepComponent,
    ChiTietDieuChinhBanTrucTiepComponent,
    ThongTinChiTietDieuChinhComponent,
    ToChucTrienKhaiBanTrucTiepComponent,
    MainTochucTrienkhiBantructiepComponent,
    ThongTinBanTrucTiepComponent,
    ThemMoiThongTinBanTrucTiepComponent,
    QuyetDinhUyquenBanleBttComponent,
    QuyetDinhUyQuenBanLeComponent,
    ThongTinQuyetDinhUyQuyenBanLeComponent,
    QuyetDinhChaogiaBttComponent,
    QuyetDinhChaoGiaComponent,
    ChiTietQuyetDinhChaoGiaComponent,
    HopDongBttComponent,
    MainHopDongBttComponent,
    DanhSachHopDongBttComponent,
    DanhSachBanTrucTiepChiCucComponent,
    QuanLyHopDongBttComponent,
    ThongTinHopDongBttComponent,
    PhuLucBttComponent,
    BangKeBanHangComponent,
    GiaoNvXuatHangBttComponent,
    QdGiaoNvXuatBttComponent,
    ThemMoiQdGiaoNvXuatBttComponent,
    KiemTraCluongBttComponent,
    MainKtraCluongBttComponent,
    BienBanLayMauBttComponent,
    ThemMoiBienBanLayMauBttComponent,
    ThemDaiDienComponent,
    PhieuKtraCluongBttComponent,
    ThemPhieuKtraCluongBttComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    XuatKhoBttComponent,
    MainXuatKhoBttComponent,
    PhieuXuatKhoBttComponent,
    ThemMoiPhieuXuatKhoBttComponent,
    BangCanKeHangBttComponent,
    ThemMoiBangKeCanHangBttComponent,
    BienBanTinhKhoBttComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiBttComponent,
    ThemMoiBienBanHaoDoiBttComponent,
  ],
  exports: [
    XuatTrucTiepComponent,
    KeHoachBanTrucTiepComponent,
    MainKeHoachBanTrucTiepComponent,
    DeXuatKhBanTrucTiepComponent,
    ThemMoiDeXuatKhBanTrucTiepComponent,
    TongHopKeHoachBanTrucTiepComponent,
    ThemMoiTongHopKhBanTrucTiepComponent,
    QuyetDinhPheDuyetKhBanTrucTiepComponent,
    ThemMoiQdPheDuyetKhBanTrucTiepComponent,
    ThongTinKhBanTrucTiepComponent,
    DieuChinhBanTrucTiepComponent,
    ChiTietDieuChinhBanTrucTiepComponent,
    ThongTinChiTietDieuChinhComponent,
    ToChucTrienKhaiBanTrucTiepComponent,
    MainTochucTrienkhiBantructiepComponent,
    ThongTinBanTrucTiepComponent,
    ThemMoiThongTinBanTrucTiepComponent,
    QuyetDinhUyquenBanleBttComponent,
    QuyetDinhUyQuenBanLeComponent,
    ThongTinQuyetDinhUyQuyenBanLeComponent,
    QuyetDinhChaogiaBttComponent,
    QuyetDinhChaoGiaComponent,
    ChiTietQuyetDinhChaoGiaComponent,
    HopDongBttComponent,
    MainHopDongBttComponent,
    DanhSachHopDongBttComponent,
    DanhSachBanTrucTiepChiCucComponent,
    QuanLyHopDongBttComponent,
    ThongTinHopDongBttComponent,
    PhuLucBttComponent,
    BangKeBanHangComponent,
    GiaoNvXuatHangBttComponent,
    QdGiaoNvXuatBttComponent,
    ThemMoiQdGiaoNvXuatBttComponent,
    KiemTraCluongBttComponent,
    MainKtraCluongBttComponent,
    BienBanLayMauBttComponent,
    ThemMoiBienBanLayMauBttComponent,
    ThemDaiDienComponent,
    PhieuKtraCluongBttComponent,
    ThemPhieuKtraCluongBttComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    XuatKhoBttComponent,
    MainXuatKhoBttComponent,
    PhieuXuatKhoBttComponent,
    ThemMoiPhieuXuatKhoBttComponent,
    BangCanKeHangBttComponent,
    ThemMoiBangKeCanHangBttComponent,
    BienBanTinhKhoBttComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiBttComponent,
    ThemMoiBienBanHaoDoiBttComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    XuatTrucTiepRoutingModule,
    KeHoachBanTrucTiepModule,
    ToChucTrienKhaiBanTrucTiepModule,
    QuyetDinhUyquenBanleBttModule,
    QuyetDinhChaogiaBttModule,
    HopDongBttModule,
    GiaoNvXuatHangBttModule,
    KiemTraCluongBttModule,
    XuatKhoBttModule,
    KeHoachVonDauNamModule,
    DauGiaModule,
  ],
})
export class XuatTrucTiepModule {
}
