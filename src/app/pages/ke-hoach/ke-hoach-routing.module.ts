import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeHoachComponent } from './ke-hoach.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachComponent,
    children: [
      {
        path: '',
        redirectTo: 'giao-ke-hoach-va-du-toan',
        pathMatch: 'full'
      },
      {
        path: 'giao-ke-hoach-va-du-toan',
        loadChildren: () =>
          import(
            '../ke-hoach/giao-ke-hoach-va-du-toan/giao-ke-hoach-va-du-toan.module'
          ).then((m) => m.GiaoKeHoachVaDuToanModule),
      },
      {
        path: 'chi-tieu-ke-hoach-nam',
        loadChildren: () =>
          import(
            './giao-ke-hoach-va-du-toan/chi-tieu-ke-hoach-nam-cap-tong-cuc/chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ChiTieuKeHoachNamModule),
      },
      {
        path: 'chi-tieu-ke-hoach-nam/thong-tin-chi-tieu-ke-hoach-nam/:id',
        loadChildren: () =>
          import(
            './giao-ke-hoach-va-du-toan/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc.module'
          ).then((m) => m.ThongTinChiTieuKeHoachNamModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule { }
