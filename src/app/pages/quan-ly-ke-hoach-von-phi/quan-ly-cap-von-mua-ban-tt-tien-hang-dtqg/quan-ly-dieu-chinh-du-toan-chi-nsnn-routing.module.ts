import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyDieuChinhDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'chi-thuong-xuyen-3-nam/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/chi-thuong-xuyen-3-nam/chi-thuong-xuyen-3-nam.module'
      ).then((m) => m.ChiThuongXuyen3NamModule),
  },
  {
    path: 'danh-sach-cap-von',
    loadChildren: () =>
      import(
        './ghi-nhan-thong-tin-nhan-tien-von-tu-btc/danh-sach-cap-von/danh-sach-cap-von.module'
      ).then((m) => m.DanhSachCapVonModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
