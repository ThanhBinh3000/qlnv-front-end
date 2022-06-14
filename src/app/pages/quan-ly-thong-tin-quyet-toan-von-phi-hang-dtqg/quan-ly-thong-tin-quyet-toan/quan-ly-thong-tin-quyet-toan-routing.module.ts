import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyThongTinQuyetToanComponent } from './quan-ly-thong-tin-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyThongTinQuyetToanComponent,
  },
  {
    path: 'danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG',
    loadChildren: () =>
      import(
        './danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG/danh-sach-bao-cao-quyet-toan-von-phi-hang-DTQG.module'
      ).then((m) => m.DanhSachBaoCaoQuyetToanVonPhiHangDTQGModule),
  },
  {
    path: 'them-moi-bao-cao-quyet-toan',
    loadChildren: () =>
      import(
        './them-moi-bao-cao-quyet-toan/them-moi-bao-cao-quyet-toan.module'
      ).then((m) => m.ThemMoiBaoCaoQuyetToanModule),
  },
  {
    path: 'dieu-chinh-so-lieu-quyet-toan',
    loadChildren: () =>
      import(
        './dieu-chinh-so-lieu-quyet-toan/dieu-chinh-so-lieu-quyet-toan.module'
      ).then((m) => m.DieuChinhSoLieuQuyetToanModule),
  },
  {
    path: 'them-moi-bao-cao-quyet-toan/:id',
    loadChildren: () =>
      import(
        './them-moi-bao-cao-quyet-toan/them-moi-bao-cao-quyet-toan.module'
      ).then((m) => m.ThemMoiBaoCaoQuyetToanModule),
  },
  {
    path: 'dieu-chinh-so-lieu-quyet-toan/:id',
    loadChildren: () =>
      import(
        './dieu-chinh-so-lieu-quyet-toan/dieu-chinh-so-lieu-quyet-toan.module'
      ).then((m) => m.DieuChinhSoLieuQuyetToanModule),
  },
  {
    path: 'dieu-chinh-so-lieu-quyet-toan-/:namQtoan',
    loadChildren: () =>
      import(
        './dieu-chinh-so-lieu-quyet-toan/dieu-chinh-so-lieu-quyet-toan.module'
      ).then((m) => m.DieuChinhSoLieuQuyetToanModule),
  },
  {
    path: 'duyet-phe-duyet-bao-cao',
    loadChildren: () =>
      import(
        './duyet-phe-duyet-bao-cao/duyet-phe-duyet-bao-cao.module'
      ).then((m) => m.DuyetPheDuyetBaoCaoModule),
  },
  {
    path: 'danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG',
    loadChildren: () =>
      import(
        './danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG/danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG.module'
      ).then((m) => m.DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyThongTinQuyetToanRoutingModule {}
