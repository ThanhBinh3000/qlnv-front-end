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
        path: 'bao-cao',
        loadChildren: () =>
          import(
            '../ke-hoach/bao-cao/bao-cao.module'
          ).then((m) => m.BaoCaoModule),
      },
      {
        path: 'du-toan-nsnn',
        loadChildren: () =>
          import(
            '../ke-hoach/du-toan-nsnn/du-toan-nsnn.module'
          ).then((m) => m.DuToanNsnnModule),
      },
      {
        path: '',
        redirectTo: 'dieu-chinh-chi-tieu-ke-hoach-nam',
        pathMatch: 'full'
      },
      {
        path: 'dieu-chinh-chi-tieu-ke-hoach-nam',
        loadChildren: () =>
          import(
            '../ke-hoach/phuong-an-gia/phuong-an-gia.module'
          ).then((m) => m.PhuongAnGiaModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule { }
