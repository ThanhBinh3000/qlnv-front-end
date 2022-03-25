import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DieuChinhChiTieuKeHoachNamComponent } from './dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { DieuChinhThongTinChiTieuKeHoachNamComponent } from './dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/dieu-chinh-thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.component';
import { KeHoachComponent } from './ke-hoach.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-tong-cuc',
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule { }
