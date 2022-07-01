import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent,
  },
  {
    path: 'bao-cao/:id',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
  {
    path: ':baoCao/:loaiBaoCao/:thang/:nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule {}
