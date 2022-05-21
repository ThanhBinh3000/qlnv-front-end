import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyLapThamDinhDuToanNSNNComponent,
  },
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  {
    path: 'phe-duyet',
    loadChildren: () =>
      import(
        './phe-duyet/phe-duyet.module'
      ).then((m) => m.PheDuyetModule),
  },
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tong-hop/tong-hop.module'
      ).then((m) => m.TonghopModule),
  },
  {
    path: 'tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.module'
      ).then((m) => m.TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnModule),
  },
  {
    path: 'xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.XayDungPhuongAnGiaoSoKiemTraChiNsnnModule),
  },
  {
    path: 'qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn.module'
      ).then((m) => m.QdCvGiaoSoKiemTraTranChiNsnnModule),
  },
  {
    path: 'tim-kiem-so-kiem-tra-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-so-kiem-tra-chi-nsnn/tim-kiem-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.TimKiemSoKiemTraChiNsnnModule),
  },
  {
    path: 'bao-cao',
    loadChildren: () =>
      import(
        './chuc-nang-bao-cao/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'bao-cao/:id',
    loadChildren: () =>
      import(
        './chuc-nang-bao-cao/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'bao-cao/0/:maDvi/:namHienHanh',
    loadChildren: () =>
      import(
        './chuc-nang-bao-cao/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'bao-cao/0/:namHienHanh',
    loadChildren: () =>
      import(
        './chuc-nang-bao-cao/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: 'so-kiem-tra-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/so-kiem-tra-chi-nsnn/so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.SoKiemTraChiNsnnModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
