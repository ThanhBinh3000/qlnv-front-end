import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyDieuChinhDuToanChiNSNNComponent } from './quan-ly-dieu-chinh-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyDieuChinhDuToanChiNSNNComponent,
  },
  // {
  //   path: 'danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach',
  //   loadChildren: () =>
  //     import(
  //       './danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach/danh-sach-de-xuat-dieu-chinh-du-toan-chi-ngan-sach.module'
  //     ).then((m) => m.DanhSachDeXuatDieuChinhDuToanChiNganSachModule),
  // },
  // {
  //   path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
  //   loadChildren: () =>
  //     import(
  //       './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
  //     ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  // },
  // {
  //   path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/:id',
  //   loadChildren: () =>
  //     import(
  //       './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
  //     ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  // },
  // {
  //   path: 'lap-bao-cao-dieu-chinh-kiem-tra',
  //   loadChildren: () =>
  //     import(
  //       './lap-bao-cao-dieu-chinh-kiem-tra/lap-bao-cao-dieu-chinh-kiem-tra.module'
  //     ).then((m) => m.LapBaoCaoDieuChinhKiemTraModule),
  // },
  // {
  //   path: 'lap-bao-cao-dieu-chinh-kiem-tra/:id',
  //   loadChildren: () =>
  //     import(
  //       './lap-bao-cao-dieu-chinh-kiem-tra/lap-bao-cao-dieu-chinh-kiem-tra.module'
  //     ).then((m) => m.LapBaoCaoDieuChinhKiemTraModule),
  // },
  // {
  //   path: 'test-link-list',
  //   loadChildren: () =>
  //     import(
  //       './test-link-list/test-link-list.module'
  //     ).then((m) => m.TestLinkListModule),
  // },

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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
