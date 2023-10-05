import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/guard/auth.guard';
import {KeHoachComponent} from './ke-hoach.component';

const routes: Routes = [
  {
    path: '',
    component: KeHoachComponent,
    canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
      },
      {
        path: 'bao-cao',
        loadChildren: () =>
          import(
            '../ke-hoach/bao-cao/bao-cao.module'
            ).then((m) => m.BaoCaoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'du-toan-nsnn',
        loadChildren: () =>
          import(
            '../ke-hoach/du-toan-nsnn/du-toan-nsnn.module'
            ).then((m) => m.DuToanNsnnModule),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        redirectTo: 'dieu-chinh-chi-tieu-ke-hoach-nam',
        pathMatch: 'full'
      },
      {
        path: 'phuong-an-gia',
        loadChildren: () =>
          import(
            '../ke-hoach/phuong-an-gia/phuong-an-gia.module'
            ).then((m) => m.PhuongAnGiaModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule {
}
