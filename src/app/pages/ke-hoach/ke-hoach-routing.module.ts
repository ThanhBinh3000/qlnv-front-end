import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeXuatDieuChinhComponent } from './de-xuat-dieu-chinh/de-xuat-dieu-chinh.component';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { KeHoachComponent } from './ke-hoach.component';
import { ThongTinDeXuatDieuChinhComponent } from './thong-tin-de-xuat-dieu-chinh/thong-tin-de-xuat-dieu-chinh.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachComponent,
    children: [
      {
        path: '',
        redirectTo: 'chi-tieu-ke-hoach-nam-cap-tong-cuc',
        pathMatch: 'full'
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-tong-cuc',
        loadChildren: () =>
          import(
            '../ke-hoach/chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ChiTieuKeHoachNamModule),
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-cuc',
        loadChildren: () =>
          import(
            '../ke-hoach/chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ChiTieuKeHoachNamModule),
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-chi-cuc',
        loadChildren: () =>
          import(
            '../ke-hoach/chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ChiTieuKeHoachNamModule),
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/:id',
        loadChildren: () =>
          import(
            '../ke-hoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ThongTinChiTieuKeHoachNamModule),
      },
      {
        path: 'dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc',
        component: DieuChinhChiTieuKeHoachNamComponent
      },
      {
        path: 'dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/:id',
        component: DieuChinhThongTinChiTieuKeHoachNamComponent
      },
      {
        path: 'dieu-chinh-chi-tieu-ke-hoach-nam-cap-cuc',
        component: DieuChinhChiTieuKeHoachNamComponent
      },
      {
        path: 'dieu-chinh-chi-tieu-ke-hoach-nam-cap-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-cuc/:id',
        component: DieuChinhThongTinChiTieuKeHoachNamComponent
      },
      {
        path: 'de-xuat-dieu-chinh-cap-tong-cuc',
        component: DeXuatDieuChinhComponent
      },
      {
        path: 'de-xuat-dieu-chinh-cap-tong-cuc/thong-tin-de-xuat-dieu-chinh-cap-tong-cuc/:id',
        component: ThongTinDeXuatDieuChinhComponent
      },
      {
        path: 'de-xuat-dieu-chinh-cap-cuc',
        component: DeXuatDieuChinhComponent
      },
      {
        path: 'de-xuat-dieu-chinh-cap-cuc/thong-tin-de-xuat-dieu-chinh-cap-cuc/:id',
        component: ThongTinDeXuatDieuChinhComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule { }
