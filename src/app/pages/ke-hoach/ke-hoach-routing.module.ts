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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeHoachRoutingModule { }
