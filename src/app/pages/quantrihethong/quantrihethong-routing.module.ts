import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachComponent } from './danhsach/danhsach.component';
import { QuanTriHeThongComponent } from './quantrihethong.component';

const routes: Routes = [
  {
    path: '',
    component: QuanTriHeThongComponent,
    children: [
      {
        path: '',
        redirectTo: 'danh-sach',
        pathMatch: 'full',
      },
      {
        path: 'danh-sach',
        component: DanhSachComponent,
      },
      // {
      //   path: 'danh-sach',
      //   loadChildren: () =>
      //     import('./danhsach/danhsach.module').then(
      //       (m) => m.DanhSachModule,
      //     ),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanTriHeThongRoutingModule { }
