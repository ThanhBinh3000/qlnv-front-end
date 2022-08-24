import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKeHoachVonPhiHangComponent } from './quan-ly-ke-hoach-von-phi-hang.component';
import { CAP_VON_MUA_BAN, CAP_VON_NGUON_CHI } from './quan-ly-ke-hoach-von-phi-hang.constant';

const routes: Routes = [
  {
    path: '',
    component: QuanLyKeHoachVonPhiHangComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: CAP_VON_NGUON_CHI,
        loadChildren: () =>
          import('./quan-ly-cap-nguon-von-chi/quan-ly-cap-nguon-von-chi.module').then(
            (m) => m.QuanLyCapNguonVonChiNSNNModule,
          )
      },
      {
        path: CAP_VON_MUA_BAN,
        loadChildren: () =>
          import('./quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.module').then(
            (m) => m.QuanLyCapVonMuaBanTtTienHangDtqgModule,
          )
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class QuanLyKeHoachVonPhiHangRoutingModule { }
