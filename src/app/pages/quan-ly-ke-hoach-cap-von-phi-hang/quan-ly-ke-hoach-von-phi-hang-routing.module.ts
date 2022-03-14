import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKeHoachVonPhiHangComponent } from './quan-ly-ke-hoach-von-phi-hang.component';

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
        path: 'quan-ly-cap-nguon-von-chi',
        loadChildren: () =>
          import('./quan-ly-cap-nguon-von-chi/quan-ly-cap-nguon-von-chi.module').then(
            (m) => m.QuanLyCapNguonVonChiNSNNModule,
        )
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyKeHoachVonPhiHangRoutingModule { }
