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
    path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn',
    loadChildren: () =>
      import(
        './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
      ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  },
  {
    path: 'lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/:id',
    loadChildren: () =>
      import(
        './lap-bao-cao-dieu-chinh-du-toan-chi-nsnn/lap-bao-cao-dieu-chinh-du-toan-chi-nsnn.module'
      ).then((m) => m.LapBaoCaoDieuChinhDuToanChiNsnnModule),
  },
  {
    path: 'dsach-dxuat-dchinh-dtoan-chi-nsach',
    loadChildren: () =>
      import(
        './dsach-dxuat-dchinh-dtoan-chi-nsach/dsach-dxuat-dchinh-dtoan-chi-nsach.module'
      ).then((m) => m.DsachDxuatDchinhDtoanChiNsachModule),
  },
  {
    path: 'thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc',
    loadChildren: () =>
      import(
        './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc/thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.module'
      ).then((m) => m.ThopBcaoDcdtChiNsnnTrinhTongCucModule),
  },
  {
    path: 'thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc/:id',
    loadChildren: () =>
      import(
        './thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc/thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.module'
      ).then((m) => m.ThopBcaoDcdtChiNsnnTrinhTongCucModule),
  },
  {
    path: 'dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc',
    loadChildren: () =>
      import(
        './dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc/dsach-thop-bcao-dcdt-chi-nsnn-trinh-tong-cuc.module'
      ).then((m) => m.DsachThopBcaoDcdtChiNsnnTrinhTongCucModule),
  },

  {
    path: 'ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui',
    loadChildren: () =>
      import(
        './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui/ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.module'
      ).then((m) => m.KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiModule),
  },
  {
    path: 'ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui/:id',
    loadChildren: () =>
      import(
        './ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui/ktra-rsoat-ndung-bcao-dcdt-nsnn-do-chi-cuc-gui.module'
      ).then((m) => m.KtraRsoatNdungBcaoDcdtNsnnDoChiCucGuiModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyDieuChinhDuToanChiNSNNRoutingModule {}
