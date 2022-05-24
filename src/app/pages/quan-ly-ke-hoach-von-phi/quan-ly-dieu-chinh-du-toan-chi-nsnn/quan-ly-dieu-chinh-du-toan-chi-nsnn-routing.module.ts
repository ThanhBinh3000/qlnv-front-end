import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyDieuChinhDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem-dieu-chinh-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './tim-kiem-dieu-chinh-du-toan-chi-NSNN/tim-kiem-dieu-chinh-du-toan-chi-NSNN.module'
      ).then((m) => m.TimKiemDieuChinhDuToanChiNSNNModule),
  },
  {
    path: 'ds-tong-hop-dieu-chinh-du-toan-chi',
    loadChildren: () =>
      import(
        './ds-tong-hop-dieu-chinh-du-toan-chi/ds-tong-hop-dieu-chinh-du-toan-chi.module'
      ).then((m) => m.DsTongHopDieuChinhDuToanChiModule),
  },
  {
    path: 'tong-hop-dieu-chinh-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './tong-hop-dieu-chinh-du-toan-chi-NSNN/tong-hop-dieu-chinh-du-toan-chi-NSNN.module'
      ).then((m) => m.TongHopDieuChinhDuToanChiNSNNModule),
  },
  {
    path: 'tong-hop-dieu-chinh-du-toan-chi-NSNN/:id',
    loadChildren: () =>
      import(
        './tong-hop-dieu-chinh-du-toan-chi-NSNN/tong-hop-dieu-chinh-du-toan-chi-NSNN.module'
      ).then((m) => m.TongHopDieuChinhDuToanChiNSNNModule),
  },
  {
    path: 'giao-nhiem-vu',
    loadChildren: () =>
      import(
        './giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },
  {
    path: 'giao-nhiem-vu/:id',
    loadChildren: () =>
      import(
        './giao-nhiem-vu/giao-nhiem-vu.module'
      ).then((m) => m.GiaoNhiemVuModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
