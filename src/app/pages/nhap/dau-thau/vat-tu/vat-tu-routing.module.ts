import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChiTietThongTinGoiThauComponent } from './chi-tiet-thong-tin-goi-thau/chi-tiet-thong-tin-goi-thau.component';
import { ChiTietThongTinLCNTComponent } from './chi-tiet-thong-tin-lcnt/chi-tiet-thong-tin-lcnt.component';
import { HoSoKyThuatVatTuComponent } from './ho-so-ky-thuat-vat-tu/ho-so-ky-thuat-vat-tu.component';
import { HopDongMuaComponent } from './hop-dong-mua/hop-dong-mua.component';
import { PhieuNhapKhoComponent } from './phieu-nhap-kho/phieu-nhap-kho.component';
import { QuyetDinhPheDuyetKeHoachLCNTComponent } from './quyet-dinh-phe-duyet-ke-hoach-lcnt/quyet-dinh-phe-duyet-ke-hoach-lcnt.component';
import { QuyetDinhPheDuyetKetQuaLCNTComponent } from './quyet-dinh-phe-duyet-ket-qua-lcnt/quyet-dinh-phe-duyet-ket-qua-lcnt.component';
import { ThongTinHoSoKyThuatComponent } from './thong-tin-ho-so-ky-thuat/thong-tin-ho-so-ky-thuat.component';
import { ThongTinHopDongMuaComponent } from './thong-tin-hop-dong-mua/thong-tin-hop-dong-mua.component';
import { ThongTinLCNTComponent } from './thong-tin-lcnt/thong-tin-lcnt.component';
import { ThongTinPhieuNhapKhoComponent } from './thong-tin-phieu-nhap-kho/thong-tin-phieu-nhap-kho.component';
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
        component: QuyetDinhPheDuyetKeHoachLCNTComponent
      },
      {
        path: 'quyet-dinh-phe-duyet-ke-hoach-lcnt/thong-tin-quyet-dinh-phe-duyet-ke-hoach-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKeHoachLCNTComponent
      },
      {
        path: 'thong-tin-lcnt',
        component: ThongTinLCNTComponent
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-lcnt/:id',
        component: ChiTietThongTinLCNTComponent
      },
      {
        path: 'thong-tin-lcnt/chi-tiet-thong-tin-goi-thau/:id',
        component: ChiTietThongTinGoiThauComponent
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt',
        component: QuyetDinhPheDuyetKetQuaLCNTComponent
      },
      {
        path: 'quyet-dinh-phe-duyet-ket-qua-lcnt/thong-tin-quyet-dinh-phe-duyet-ket-qua-lcnt/:id',
        component: ThongTinQuyetDinhPheDuyetKetQuaLCNTComponent
      },
      {
        path: 'hop-dong-mua',
        component: HopDongMuaComponent
      },
      {
        path: 'hop-dong-mua/thong-tin-hop-dong-mua/:id',
        component: ThongTinHopDongMuaComponent
      },
      {
        path: 'ho-so-ky-thuat',
        component: HoSoKyThuatVatTuComponent
      },
      {
        path: 'ho-so-ky-thuat/thong-tin-ho-so-ky-thuat/:id',
        component: ThongTinHoSoKyThuatComponent
      },
      {
        path: 'phieu-nhap-kho',
        component: PhieuNhapKhoComponent
      },
      {
        path: 'phieu-nhap-kho/thong-tin-phieu-nhap-kho/:id',
        component: ThongTinPhieuNhapKhoComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatTuRoutingModule { }
