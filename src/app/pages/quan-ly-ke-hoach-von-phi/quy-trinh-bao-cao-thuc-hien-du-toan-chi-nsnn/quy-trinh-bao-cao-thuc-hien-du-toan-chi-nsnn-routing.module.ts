import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent } from './quy-trinh-bao-cao-thuc-hien-du-toan-chi-nsnn.component';

const routes: Routes = [
  {
    path: '',
    component: QuyTrinhBaoCaoThucHienDuToanChiNSNNComponent,
  },
  {
    path: 'ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.module'
      ).then((m) => m.DsBaoCaoTinhHinhSdDtoanThangNamModule),
  },
  {
    path: 'ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-chi-cuc',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.module'
      ).then((m) => m.DsBaoCaoTinhHinhSdDtoanThangNamTuCCModule),
  },

  //hung
  {
    path: 'bao-cao',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/bao-cao/bao-cao.module'
      ).then((m) => m.BaoCaoModule),
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
  {
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC/tong-hop-bc-tinh-hinh-su-dung-du-toan-tu-CC.module'
      ).then((m) => m.TongHopBCTinhHinhSuDungDuToanTuCCModule),
  },
  {
    path: 'kiem-tra',
    loadChildren: () =>
      import(
        './chuc-nang-cuc-khu-vuc/kiem-tra/kiem-tra.module'
      ).then((m) => m.KiemTraModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule {}
