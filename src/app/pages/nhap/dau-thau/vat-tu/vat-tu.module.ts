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
  ],
  imports: [CommonModule, VatTuRoutingModule, ComponentsModule, MainModule],
})
export class VatTuModule {}
