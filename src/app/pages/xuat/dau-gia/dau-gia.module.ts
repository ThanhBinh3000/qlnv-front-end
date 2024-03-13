import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ComponentsModule} from 'src/app/components/components.module';
import {DirectivesModule} from 'src/app/directives/directives.module';
import {DauGiaRoutingModule} from './dau-gia-routing.module';
import {DauGiaComponent} from './dau-gia.component';
import {GiaoXuatHangModule} from './giao-xuat-hang/giao-xuat-hang.module';
import {HopDongModule} from './hop-dong/hop-dong.module';
import {KiemTraChatLuongModule} from './kiem-tra-chat-luong/kiem-tra-chat-luong.module';
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
import {
  ChiTietHoSoKyThuatComponent
} from "src/app/pages/xuat/dau-gia/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat.component";
import {
  ChiTietBienBanKiemTraComponent
} from "src/app/pages/xuat/dau-gia/kiem-tra-chat-luong/ho-so-ky-thuat/chi-tiet-ho-so-ky-thuat/chi-tiet-bien-ban-kiem-tra/chi-tiet-bien-ban-kiem-tra.component";
import {QuyetDinhPheDuyetKetQuaModule} from "./quyet-dinh-phe-duyet-ket-qua/quyet-dinh-phe-duyet-ket-qua.module";
import {GiaoXuatHangComponent} from "./giao-xuat-hang/giao-xuat-hang.component";
import {CreateGiaoXh} from "./giao-xuat-hang/crup-giao-xh/create-giao-xh.component";
import {TableGiaoXh} from "./giao-xuat-hang/table-giao-xh/table-giao-xh.component";
import {MainHopDongComponent} from "./hop-dong/main-hop-dong/main-hop-dong.component";
import {DanhSachHopDongComponent} from "./hop-dong/danh-sach-hop-dong/danh-sach-hop-dong.component";
import {QuanlyHopdongComponent} from "./hop-dong/danh-sach-hop-dong/quanly-hopdong/quanly-hopdong.component";
import {HopDongComponent} from "./hop-dong/hop-dong.component";
import {ThongTinComponent} from "./hop-dong/danh-sach-hop-dong/thong-tin/thong-tin.component";
import {PhuLucComponent} from "./hop-dong/danh-sach-hop-dong/phu-luc/phu-luc.component";
import {QuyetDinhPheDuyetKetQuaComponent} from "./quyet-dinh-phe-duyet-ket-qua/quyet-dinh-phe-duyet-ket-qua.component";
import {
  DanhSachQuyetDinhPheDuyetKetQuaComponent
} from "./quyet-dinh-phe-duyet-ket-qua/danh-sach-quyet-dinh-phe-duyet-ket-qua/danh-sach-quyet-dinh-phe-duyet-ket-qua.component";
import {
  ThemMoiQuyetDinhPheDuyetKetQuaComponent
} from "./quyet-dinh-phe-duyet-ket-qua/danh-sach-quyet-dinh-phe-duyet-ket-qua/them-moi-quyet-dinh-phe-duyet-ket-qua/them-moi-quyet-dinh-phe-duyet-ket-qua.component";
import {MainTochucTrienkhaiComponent} from "./to-chuc-trien-khai/main-tochuc-trienkhai/main-tochuc-trienkhai.component";
import {
  ThongTinDauGiaComponent
} from "./to-chuc-trien-khai/main-tochuc-trienkhai/thong-tin-dau-gia/thong-tin-dau-gia.component";
import {
  ChiTietThongTinDauGiaComponent
} from "./to-chuc-trien-khai/main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia.component";
import {
  ThongtinDaugiaComponent
} from "./to-chuc-trien-khai/main-tochuc-trienkhai/thong-tin-dau-gia/chi-tiet-thong-tin-dau-gia/thongtin-daugia/thongtin-daugia.component";
import {
  KeHoachVonDauNamModule
} from "../../ke-hoach/giao-ke-hoach-va-du-toan/ke-hoach-von-dau-nam/ke-hoach-von-dau-nam.module";
import {
  MainKeHoachBanDauGiaComponent
} from "./ke-hoach-ban-dau-gia/main-ke-hoach-ban-dau-gia/main-ke-hoach-ban-dau-gia.component";
import {DeXuatComponent} from "./ke-hoach-ban-dau-gia/de-xuat/de-xuat.component";
import {
  ThemDeXuatKeHoachBanDauGiaComponent
} from "./ke-hoach-ban-dau-gia/de-xuat/them-de-xuat-ke-hoach-ban-dau-gia/them-de-xuat-ke-hoach-ban-dau-gia.component";
import {TongHopComponent} from "./ke-hoach-ban-dau-gia/tong-hop/tong-hop.component";
import {
  ThemMoiTongHopKeHoachBanDauGiaComponent
} from "./ke-hoach-ban-dau-gia/tong-hop/them-moi-tong-hop-ke-hoach-ban-dau-gia/them-moi-tong-hop-ke-hoach-ban-dau-gia.component";
import {QuyetDinhComponent} from "./ke-hoach-ban-dau-gia/quyet-dinh/quyet-dinh.component";
import {
  ThemQuyetDinhBanDauGiaComponent
} from "./ke-hoach-ban-dau-gia/quyet-dinh/them-quyet-dinh-ban-dau-gia/them-quyet-dinh-ban-dau-gia.component";
import {
  ThongtinDexuatKhbdgComponent
} from "./ke-hoach-ban-dau-gia/quyet-dinh/them-quyet-dinh-ban-dau-gia/thongtin-dexuat-khbdg/thongtin-dexuat-khbdg.component";
import {DieuChinhComponent} from "./ke-hoach-ban-dau-gia/dieu-chinh/dieu-chinh.component";
import {
  ThemMoiDieuChinhComponent
} from "./ke-hoach-ban-dau-gia/dieu-chinh/them-moi-dieu-chinh/them-moi-dieu-chinh.component";
import {
  ThongTinDieuChinhComponent
} from "./ke-hoach-ban-dau-gia/dieu-chinh/them-moi-dieu-chinh/thong-tin-dieu-chinh/thong-tin-dieu-chinh.component";

@NgModule({
  declarations: [
    DauGiaComponent,
    KeHoachBanDauGiaComponent,
    MainKeHoachBanDauGiaComponent,
    DeXuatComponent,
    ThemDeXuatKeHoachBanDauGiaComponent,
    TongHopComponent,
    ThemMoiTongHopKeHoachBanDauGiaComponent,
    QuyetDinhComponent,
    ThemQuyetDinhBanDauGiaComponent,
    ThongtinDexuatKhbdgComponent,
    DieuChinhComponent,
    ThemMoiDieuChinhComponent,
    ThongTinDieuChinhComponent,
    ToChucTrienKhaiComponent,
    MainTochucTrienkhaiComponent,
    ThongTinDauGiaComponent,
    ChiTietThongTinDauGiaComponent,
    ThongtinDaugiaComponent,
    QuyetDinhPheDuyetKetQuaComponent,
    DanhSachQuyetDinhPheDuyetKetQuaComponent,
    ThemMoiQuyetDinhPheDuyetKetQuaComponent,
    HopDongComponent,
    MainHopDongComponent,
    DanhSachHopDongComponent,
    QuanlyHopdongComponent,
    ThongTinComponent,
    PhuLucComponent,
    GiaoXuatHangComponent,
    CreateGiaoXh,
    TableGiaoXh,
    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauComponent,
    CreateDaiDienComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    XuatKhoComponent,
    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    ChiTietBangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
  ],
  exports: [
    DauGiaComponent,
    KeHoachBanDauGiaComponent,
    MainKeHoachBanDauGiaComponent,
    DeXuatComponent,
    ThemDeXuatKeHoachBanDauGiaComponent,
    TongHopComponent,
    ThemMoiTongHopKeHoachBanDauGiaComponent,
    QuyetDinhComponent,
    ThemQuyetDinhBanDauGiaComponent,
    ThongtinDexuatKhbdgComponent,
    DieuChinhComponent,
    ThemMoiDieuChinhComponent,
    ThongTinDieuChinhComponent,
    ToChucTrienKhaiComponent,
    MainTochucTrienkhaiComponent,
    ThongTinDauGiaComponent,
    ChiTietThongTinDauGiaComponent,
    ThongtinDaugiaComponent,
    QuyetDinhPheDuyetKetQuaComponent,
    DanhSachQuyetDinhPheDuyetKetQuaComponent,
    ThemMoiQuyetDinhPheDuyetKetQuaComponent,
    HopDongComponent,
    MainHopDongComponent,
    DanhSachHopDongComponent,
    QuanlyHopdongComponent,
    ThongTinComponent,
    PhuLucComponent,
    GiaoXuatHangComponent,
    CreateGiaoXh,
    TableGiaoXh,
    KiemTraChatLuongComponent,
    ChucNangKiemTraComponent,
    TableBienBanLayMauComponent,
    CreateBienBanLayMauComponent,
    CreateDaiDienComponent,
    QuanLyPhieuKiemNghiemChatLuongComponent,
    ThemMoiPhieuKiemNghiemChatLuongComponent,
    HoSoKyThuatComponent,
    ChiTietHoSoKyThuatComponent,
    ChiTietBienBanKiemTraComponent,
    XuatKhoComponent,
    MainXuatKhoComponent,
    PhieuXuatKhoComponent,
    ThemMoiPhieuXuatKhoComponent,
    BangKeCanComponent,
    ChiTietBangKeCanComponent,
    BienBanTinhKhoComponent,
    ThemMoiBienBanTinhKhoComponent,
    BienBanHaoDoiComponent,
    ThemMoiBienBanHaoDoiComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    DauGiaRoutingModule,
    KeHoachBanDauGiaModule,
    ToChucTrienKhaiModule,
    QuyetDinhPheDuyetKetQuaModule,
    HopDongModule,
    GiaoXuatHangModule,
    KiemTraChatLuongModule,
    XuatKhoModule,
    KeHoachVonDauNamModule,
  ]
})
export class DauGiaModule {
}
