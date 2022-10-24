import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyThongTinQuyetToanVonPhiHangDtqgComponent } from './quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyThongTinQuyetToanVonPhiHangDtqgComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: 'quan-ly-thong-tin-quyet-toan',
        loadChildren: () =>
          import('./quan-ly-thong-tin-quyet-toan/quan-ly-thong-tin-quyet-toan.module').then(
            (m) => m.QuanLyThongTinQuyetToanModule,
        )
      },
      {
        path: 'von-phi-hang-cua-bo-nganh',
        loadChildren: () =>
          import('./von-phi-hang-cua-bo-nganh/von-phi-hang-cua-bo-nganh.module').then(
            (m) => m.VonPhiHangCuaBoNganhModule,
          )
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyThongTinQuyetToanVonPhiHangDtqgRoutingModule { }
