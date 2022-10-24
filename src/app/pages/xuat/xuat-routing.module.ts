import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatComponent } from './xuat.component';

const routes: Routes = [
  {
    path: '',
    component: XuatComponent,
    children: [
      {
        path: '',
        redirectTo: `dau-gia`,
        pathMatch: 'full',
      },
      {
        path: 'dau-gia',
        loadChildren: () =>
          import('./dau-gia/dau-gia.module').then((m) => m.DauGiaModule),
      },
      {
        path: 'cuu-tro-vien-tro',
        loadChildren: () =>
          import('./cuu-tro-vien-tro/cuu-tro-vien-tro.module').then((m) => m.CuuTroVienTroModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatRoutingModule { }
