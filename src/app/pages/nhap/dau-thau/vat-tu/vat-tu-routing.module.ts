import { BienBanGiaoNhanComponent } from './bien-ban-giao-nhan/bien-ban-giao-nhan.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienBanBanGiaoMauComponent } from './bien-ban-ban-giao-mau/bien-ban-ban-giao-mau.component';
import { ThemBienBanBanGiaoMauComponent } from './bien-ban-ban-giao-mau/them-bien-ban-ban-giao-mau/them-bien-ban-ban-giao-mau.component';
import { BienBanChuanBiKhoTruocKhiNhapHangComponent } from './bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/bien-ban-chuan-bi-kho-truoc-khi-nhap-hang.component';
import { ThemBienBanChuanBiKhoTruocKhiNhapHangComponent } from './bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/them-bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/them-bien-ban-chuan-bi-kho-truoc-khi-nhap-hang.component';
import { BienBanGuiHangComponent } from './bien-ban-gui-hang/bien-ban-gui-hang.component';
import { ThemBienBanGuiHangComponent } from './bien-ban-gui-hang/them-bien-ban-gui-hang/them-bien-ban-gui-hang.component';
import { BienBanKetThucNhapKhoComponent } from './bien-ban-ket-thuc-nhap-kho/bien-ban-ket-thuc-nhap-kho.component';
import { ChiTietThongTinGoiThauComponent } from './chi-tiet-thong-tin-goi-thau/chi-tiet-thong-tin-goi-thau.component';
import { ChiTietThongTinLCNTComponent } from './chi-tiet-thong-tin-lcnt/chi-tiet-thong-tin-lcnt.component';
import { HoSoKyThuatVatTuComponent } from './ho-so-ky-thuat-vat-tu/ho-so-ky-thuat-vat-tu.component';
import { HopDongMuaComponent } from './hop-dong-mua/hop-dong-mua.component';
import { PhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/phieu-nhap-kho-tam-gui.component';
import { ThemPhieuNhapKhoTamGuiComponent } from './phieu-nhap-kho-tam-gui/them-phieu-nhap-kho-tam-gui/them-phieu-nhap-kho-tam-gui.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { QuanLyBangCanKeHangComponent } from './quan-ly-bang-can-ke-hang/quan-ly-bang-can-ke-hang.component';
import { QuyetDinhGiaoNhiemVuNhapHangComponent } from './quyet-dinh-giao-nhiem-vu-nhap-hang/quyet-dinh-giao-nhiem-vu-nhap-hang.component';
import { ThemQuyetDinhGiaoNhiemVuNhapHangComponent } from './quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang.component';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinBienBanGiaoNhanComponent } from './thong-tin-bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan.component';
import { ThongTinBienBanKetThucNhapKhoComponent } from './thong-tin-bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho.component';
import { ThongTinHoSoKyThuatComponent } from './thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { ThongTinHopDongMuaComponent } from './thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { ThongTinLCNTComponent } from './thong-tin-lcnt/thong-tin-lcnt.component';
import { ThongTinPhieuNhapKhoComponent } from './thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
import { ThongTinQuanLyBangCanKeHangComponent } from './thong-tin-quan-ly-bang-can-ke-hang/thong-tin-quan-ly-bang-can-ke-hang.component';
import { ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent } from './thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { VatTuComponent } from './vat-tu.component';

const routes: Routes = [
  {
    path: '',
    component: VatTuComponent,
    children: [
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lcnt',
        component: QuyetDinhPheDuyetKeHoachLCNTComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent,
      },
      {
        path: 'thong-tin-lcnt',
        component: ThongTinLCNTComponent,
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-lcnt/:id',
        component: ChiTietThongTinLCNTComponent,
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-goi-thau/:id',
        component: ChiTietThongTinGoiThauComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt',
        component: QuyetDinhPheDuyetKetQuaLCNTComponent,
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent,
      },
      {
        path: 'hop-dong-mua',
        component: HopDongMuaComponent,
      },
      {
        path: 'hop-dong-mua/thong-tin-hop-dong-mua/:id',
        component: ThongTinHopDongMuaComponent,
      },
      {
        path: 'ho-so-ky-thuat',
        component: HoSoKyThuatVatTuComponent,
      },
      {
        path: 'ho-so-ky-thuat/thong-tin-ho-so-ky-thuat/:id',
        component: ThongTinHoSoKyThuatComponent,
      },
      {
        path: 'phieu-nhap-kho',
        component: PhieuNhapKhoComponent,
      },
      {
        path: 'phieu-nhap-kho/thong-tin-phieu-nhap-kho/:id',
        component: ThongTinPhieuNhapKhoComponent,
      },
      {
        path: 'quan-ly-bang-can-ke-hang',
        component: QuanLyBangCanKeHangComponent,
      },
      {
        path: 'quan-ly-bang-can-ke-hang/thong-tin-quan-ly-bang-can-ke-hang/:id',
        component: ThongTinQuanLyBangCanKeHangComponent,
      },
      {
        path: 'bien-ban-ket-thuc-nhap-kho',
        component: BienBanKetThucNhapKhoComponent,
      },
      {
        path: 'bien-ban-ket-thuc-nhap-kho/thong-tin-bien-ban-ket-thuc-nhap-kho/:id',
        component: ThongTinBienBanKetThucNhapKhoComponent,
      },
      {
        path: 'quyet-dinh-giao-nhiem-vu-nhap-hang',
        component: QuyetDinhGiaoNhiemVuNhapHangComponent,
      },
      {
        path: 'quyet-dinh-giao-nhiem-vu-nhap-hang/them-quyet-dinh-giao-nhiem-vu-nhap-hang/:id',
        component: ThemQuyetDinhGiaoNhiemVuNhapHangComponent,
      },
      {
        path: 'bien-ban-giao-nhan',
        component: BienBanGiaoNhanComponent,
      },
      {
        path: 'bien-ban-giao-nhan/thong-tin-bien-ban-giao-nhan/:id',
        component: ThongTinBienBanGiaoNhanComponent,
      },
      {
        path: 'bien-ban-chuan-bi-kho-truoc-khi-nhap-hang',
        component: BienBanChuanBiKhoTruocKhiNhapHangComponent,
      },
      {
        path: 'bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/them-bien-ban-chuan-bi-kho-truoc-khi-nhap-hang/:id',
        component: ThemBienBanChuanBiKhoTruocKhiNhapHangComponent,
      },
      {
        path: 'phieu-nhap-kho-tam-gui',
        component: PhieuNhapKhoTamGuiComponent,
      },
      {
        path: 'phieu-nhap-kho-tam-gui/them-phieu-nhap-kho-tam-gui/:id',
        component: ThemPhieuNhapKhoTamGuiComponent,
      },
      {
        path: 'bien-ban-gui-hang',
        component: BienBanGuiHangComponent,
      },
      {
        path: 'bien-ban-gui-hang/them-bien-ban-gui-hang/:id',
        component: ThemBienBanGuiHangComponent,
      },
      {
        path: 'bien-ban-ban-giao-mau',
        component: BienBanBanGiaoMauComponent,
      },
      {
        path: 'bien-ban-ban-giao-mau/them-bien-ban-ban-giao-mau/:id',
        component: ThemBienBanBanGiaoMauComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VatTuRoutingModule {}
