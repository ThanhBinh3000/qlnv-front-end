import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyThongTinQuyetToanComponent } from './quan-ly-thong-tin-quyet-toan.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyThongTinQuyetToanComponent,
  },
  {
    path: 'danh-sach-tong-hop-so-lieu-quyet-toan',
    loadChildren: () =>
      import(
        './danh-sach-tong-hop-so-lieu-quyet-toan/danh-sach-tong-hop-so-lieu-quyet-toan.module'
      ).then((m) => m.DanhSachTongHopSoLieuQuyetToanModule),
  },
  {
    path: 'danh-sach-dieu-chinh-so-lieu-sau-quyet-toan',
    loadChildren: () =>
      import(
        './danh-sach-dieu-chinh-so-lieu-sau-quyet-toan/danh-sach-dieu-chinh-so-lieu-sau-quyet-toan.module'
      ).then((m) => m.DanhSachDieuChinhSoLieuSauQuyetToanModule),
  },
  {
    path: 'tong-hop-so-lieu-quyet-toan',
    loadChildren: () =>
      import(
        './tong-hop-so-lieu-quyet-toan/tong-hop-so-lieu-quyet-toan.module'
      ).then((m) => m.TongHopSoLieuQuyetToanModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyThongTinQuyetToanRoutingModule {}
