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
      // {
      //   path: 'quan-ly-thong-tin-quyet-toan',
      //   loadChildren: () =>
      //     import('./quan-ly-thong-tin-quyet-toan/quan-ly-thong-tin-quyet-toan.module').then(
      //       (m) => m.QuanLyThongTinQuyetToanModule,
      //     )
      // },
      {
        path: 'quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg',
        loadChildren: () =>
          import('./von-phi-hang-du-tru-quoc-gia/von-phi-hang-du-tru-quoc-gia.module').then(
            (m) => m.VonPhiHangDuTruQuocGiaModule,
          )
      },
      {
        path: 'von-phi-hang-cua-bo-nganh',
        loadChildren: () =>
          import('./von-phi-hang-cua-bo-nganh/von-phi-hang-cua-bo-nganh.module').then(
            (m) => m.VonPhiHangCuaBoNganhModule,
          )
      },
      {
        path: 'tong-hop-va-phe-duyet',
        loadChildren: () =>
          import('./tonghop-pheduyet/tonghop-pheduyet.module').then(
            (m) => m.TonghopPheduyetModule,
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
