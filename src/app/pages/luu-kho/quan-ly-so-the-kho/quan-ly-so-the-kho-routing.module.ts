import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLySoTheKhoComponent } from './quan-ly-so-the-kho.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLySoTheKhoComponent,
    children: [
      {
        path: '',
        redirectTo: 'so-kho-the-kho',
        pathMatch: 'full',
      },
      {
        path: 'so-kho-the-kho',
        loadChildren: () =>
          import(
            '../../luu-kho/quan-ly-so-the-kho/so-kho-the-kho/so-kho-the-kho.module'
          ).then((m) => m.SoKhoTheKhoModule),
      },
      {
        path: 'hang-trong-kho',
        loadChildren: () =>
          import(
            '../../luu-kho/quan-ly-so-the-kho/hang-trong-kho/hang-trong-kho.module'
          ).then((m) => m.HangTrongKhoModule),
      },
      {
        path: 'hang-theo-doi-dac-thu',
        loadChildren: () =>
          import(
            '../../luu-kho/quan-ly-so-the-kho/hang-theo-doi-dac-thu/hang-theo-doi-dac-thu.module'
          ).then((m) => m.HangTheoDoiDacThuModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLySoTheKhoRoutingModule {}
