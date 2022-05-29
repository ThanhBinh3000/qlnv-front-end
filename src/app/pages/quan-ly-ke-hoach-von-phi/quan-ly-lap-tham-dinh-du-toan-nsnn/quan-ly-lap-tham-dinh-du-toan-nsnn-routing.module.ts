import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyLapThamDinhDuToanNSNNComponent } from './quan-ly-lap-tham-dinh-du-toan-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyLapThamDinhDuToanNSNNComponent,
  },
  //tim kiem bao cao lap tham dinh
  {
    path: 'tim-kiem',
    loadChildren: () =>
      import(
        './tim-kiem/tim-kiem.module'
      ).then((m) => m.TimKiemModule),
  },
  //phe duyet bao cao
  {
    path: 'phe-duyet',
    loadChildren: () =>
      import(
        './phe-duyet/phe-duyet.module'
      ).then((m) => m.PheDuyetModule),
  },
  //tong hop bao cao
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tong-hop/tong-hop.module'
      ).then((m) => m.TonghopModule),
  },
  //tim kiem phuong an, quyet dinh, cong van giao so kiem tra nsnn
  {
    path: 'tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-phuong-an-qd-cv-giao-so-kiem-tra-nsnn.module'
      ).then((m) => m.TimKiemPhuongAnQdCvGiaoSoKiemTraNsnnModule),
  },
  //xay dung phuong an giao so kiem tra chi nsnn
  {
    path: 'xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.XayDungPhuongAnGiaoSoKiemTraChiNsnnModule),
  },
  {
    path: 'xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/:id',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.XayDungPhuongAnGiaoSoKiemTraChiNsnnModule),
  },
  {
    path: 'xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/0/:maBaoCao',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn/xay-dung-phuong-an-giao-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.XayDungPhuongAnGiaoSoKiemTraChiNsnnModule),
  },
  //nhap so quyet dinh, cong van
  {
    path: 'qd-cv-giao-so-kiem-tra-tran-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn/qd-cv-giao-so-kiem-tra-tran-chi-nsnn.module'
      ).then((m) => m.QdCvGiaoSoKiemTraTranChiNsnnModule),
  },
  //tim kiem so kiem tra chi nsnn
  {
    path: 'tim-kiem-so-kiem-tra-chi-nsnn',
    loadChildren: () =>
      import(
        './phuong-an-qd-cv-giao-so-kiem-tra-nsnn/tim-kiem-so-kiem-tra-chi-nsnn/tim-kiem-so-kiem-tra-chi-nsnn.module'
      ).then((m) => m.TimKiemSoKiemTraChiNsnnModule),
  },
  //bao cao lap tham dinh
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
  //so kiem tra chi nsnn
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
