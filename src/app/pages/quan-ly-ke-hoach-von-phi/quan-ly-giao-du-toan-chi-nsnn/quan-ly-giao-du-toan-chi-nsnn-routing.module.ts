import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyGiaoDuToanChiNSNNComponent } from './quan-ly-giao-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyGiaoDuToanChiNSNNComponent,
  },
  {
    path: 'tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN/tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.module'
      ).then((m) => m.TimKiemQuyetDinhNhapDuToanChiNSNNModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
  {
    path: 'nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/:id',
    loadChildren: () =>
      import(
        './chuc-nang-TCDT/nhap-quyet-dinh-giao-du-toan-chi-NSNN/nhap-quyet-dinh-giao-du-toan-chi-NSNN.module'
      ).then((m) => m.NhapQuyetDinhGiaoDuToanChiNSNNModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyGiaoDuToanChiNSNNRoutingModule {}
