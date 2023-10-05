import { KeHoachLuaChonNhaThauVatTuComponent } from './ke-hoach-lua-chon-nha-thau-vat-tu/ke-hoach-lua-chon-nha-thau-vat-tu.component';
import { ThongTinBienBanGiaoNhanComponent } from './thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';
import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatTuRoutingModule } from './vat-tu-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { MainModule } from 'src/app/layout/main/main.module';
import { VatTuComponent } from './vat-tu.component';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinLCNTComponent } from './thong-tin-lcnt/thong-tin-lcnt.component';
import { ChiTietThongTinLCNTComponent } from './chi-tiet-thong-tin-lcnt/chi-tiet-thong-tin-lcnt.component';
import { ChiTietThongTinGoiThauComponent } from './chi-tiet-thong-tin-goi-thau/chi-tiet-thong-tin-goi-thau.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { HopDongMuaComponent } from './hop-dong-mua/hop-dong-mua.component';
import { ThongTinHopDongMuaComponent } from './thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { HoSoKyThuatVatTuComponent } from './ho-so-ky-thuat-vat-tu/ho-so-ky-thuat-vat-tu.component';
import { ThongTinHoSoKyThuatComponent } from './thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { ThongTinPhieuNhapKhoComponent } from './thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { QuanLyBangCanKeHangComponent } from './quan-ly-bang-can-ke-hang/quan-ly-bang-can-ke-hang.component';
import { ThongTinQuanLyBangCanKeHangComponent } from './thong-tin-quan-ly-bang-can-ke-hang/thong-tin-quan-ly-bang-can-ke-hang.component';
import { BienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho.component';
import { QuyetDinhGiaoNhiemVuNhapHangComponent } from './quyet-dinh-giao-nhiem-vu-nhap-hang/quyet-dinh-giao-nhiem-vu-nhap-hang.component';
import { ThemQuyetDinhGiaoNhiemVuNhapHangComponent } from './quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang.component';
import { BienBanChuanBiKhoTruocKhiNhapHangComponent } from './bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/bien-ban-chuan-bi-kho-truoc-khi-nhap-hang.component';
import { ThemBienBanChuanBiKhoTruocKhiNhapHangComponent } from './bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/them-bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/them-bien-ban-chuan-bi-kho-truoc-khi-nhap-hang.component';
import { ThemPhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/them-phieu-nhap-kho-tam-gui/them-phieu-nhap-kho-tam-gui.component';
import { PhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/phieu-nhap-kho-tam-gui.component';
import { ThemBienBanGuiHangComponent } from './bien-ban-gui-hang/them-bien-ban-gui-hang/them-bien-ban-gui-hang.component';
import { BienBanGuiHangComponent } from './bien-ban-gui-hang/bien-ban-gui-hang.component';
import { ThemBienBanBanGiaoMauComponent } from './bien-ban-ban-giao-mau/them-bien-ban-ban-giao-mau/them-bien-ban-ban-giao-mau.component';
import { BienBanBanGiaoMauComponent } from './bien-ban-ban-giao-mau/bien-ban-ban-giao-mau.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import {
  ThongTinKeHoachLuaChonNhaThauVatTuComponent
} from "./thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu/thong-tin-ke-hoach-lua-chon-nha-thau-vat-tu.component";

@NgModule({
  declarations: [
    VatTuComponent,
    QuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent,
    ThongTinLCNTComponent,
    ChiTietThongTinLCNTComponent,
    ChiTietThongTinGoiThauComponent,
    QuyetDinhPheDuyetKetQuaLCNTComponent,
    ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
    HopDongMuaComponent,
    ThongTinHopDongMuaComponent,
    HoSoKyThuatVatTuComponent,
    ThongTinHoSoKyThuatComponent,
    PhieuNhapKhoComponent,
    ThongTinPhieuNhapKhoComponent,
    QuanLyBangCanKeHangComponent,
    ThongTinQuanLyBangCanKeHangComponent,
    BienBanKetThucNhapKhoComponent,
    ThongTinBienBanKetThucNhapKhoComponent,
    QuyetDinhGiaoNhiemVuNhapHangComponent,
    ThemQuyetDinhGiaoNhiemVuNhapHangComponent,
    BienBanGiaoNhanComponent,
    ThongTinBienBanGiaoNhanComponent,
    BienBanChuanBiKhoTruocKhiNhapHangComponent,
    ThemBienBanChuanBiKhoTruocKhiNhapHangComponent,
    ThemPhieuNhapKhoTamGuiComponent,
    PhieuNhapKhoTamGuiComponent,
    ThemBienBanGuiHangComponent,
    BienBanGuiHangComponent,
    ThemBienBanBanGiaoMauComponent,
    BienBanBanGiaoMauComponent,
    KeHoachLuaChonNhaThauVatTuComponent,
    ThongTinKeHoachLuaChonNhaThauVatTuComponent,
  ],
  imports: [CommonModule, VatTuRoutingModule, ComponentsModule, MainModule, DirectivesModule],
})
export class VatTuModule { }
