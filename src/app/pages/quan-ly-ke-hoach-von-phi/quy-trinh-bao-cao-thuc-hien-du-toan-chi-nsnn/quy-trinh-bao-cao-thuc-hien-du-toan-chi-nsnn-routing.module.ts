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
        './chuc-nang-chi-cuc/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC/ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam-tu-CC.module'
      ).then((m) => m.DsBaoCaoTinhHinhSdDtoanThangNamTuCCModule),
  },
  {
    path: 'ds-chi-tiet-nhap-lieu-bao-cao',
    loadChildren: () =>
      import(
        './chuc-nang-chi-cuc/ds-chi-tiet-nhap-lieu-bao-cao/ds-chi-tiet-nhap-lieu-bao-cao.module'
      ).then((m) => m.DsChiTietNhapLieuBaoCaoModule),
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

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuyTrinhBaoCaoThucHienDuToanChiNSNNRoutingModule {}
