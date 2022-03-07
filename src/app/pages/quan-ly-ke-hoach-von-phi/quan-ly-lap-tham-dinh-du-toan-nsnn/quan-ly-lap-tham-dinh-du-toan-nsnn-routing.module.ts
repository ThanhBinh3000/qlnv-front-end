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
    path: 'tong-hop',
    loadChildren: () =>
      import(
        './tong-hop/tong-hop.module'
      ).then((m) => m.TonghopModule),
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
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:id',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'ke-hoach-xay-dung-van-ban-quy-pham-phap-luat-dtqg-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren: () =>
      import(
        './nhom-chuc-nang-TCDT/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam/kehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3nam.module'
      ).then((m) => m.KehoachxaydungvanbanquyphamphapluatDTQGgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:id',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  },
  {
    path:'thuyet-minh-chi-cac-de-tai-du-an-nghien-cuu-khoa-hoc-giai-doan-3nam/:maDvi/:maLoaiBacao/:nam',
    loadChildren:() => import('./nhom-chuc-nang-TCDT/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam/thuyetminhchicacdetai-duannghiencuukhoahocgiaidoan3nam.module')
    .then((m)=> m.ThuyetminhchicacdetaiDuannghiencuukhoahocgiaidoan3namModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyLapThamDinhDuToanNSNNRoutingModule {}
