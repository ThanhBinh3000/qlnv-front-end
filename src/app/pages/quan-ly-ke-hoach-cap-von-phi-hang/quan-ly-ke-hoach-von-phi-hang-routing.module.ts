import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKeHoachVonPhiHangComponent } from './quan-ly-ke-hoach-von-phi-hang.component';
import { CAP_PHI_CHI, CAP_VON_CHI, CAP_VON_MUA_BAN } from './quan-ly-ke-hoach-von-phi-hang.constant';

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
        path: CAP_VON_CHI,
        loadChildren: () =>
          import('./cap-von-chi/cap-von-chi.module').then(
            (m) => m.CapVonChiModule,
          )
      },
      {
        path: CAP_PHI_CHI,
        loadChildren: () =>
          import('./cap-phi-chi/cap-phi-chi.module').then(
            (m) => m.CapPhiChiModule,
          )
      },
      {
        path: CAP_VON_MUA_BAN,
        loadChildren: () =>
          import('./cap-von-mua-ban-va-thanh-toan-tien-hang/cap-von-mua-ban-va-thanh-toan-tien-hang.module').then(
            (m) => m.CapVonMuaBanVaThanhToanTienHangModule,
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
