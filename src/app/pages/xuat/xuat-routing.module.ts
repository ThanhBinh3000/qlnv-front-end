import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XuatComponent } from './xuat.component';

const routes: Routes = [
  {
    path: '',
    component: XuatComponent,
    children: [
      {
        path: 'dau-gia',
        loadChildren: () =>
          import('./dau-gia/dau-gia.module').then((m) => m.DauGiaModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XuatRoutingModule {}
