import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuanLyKeHoachVonPhiComponent } from './quan-ly-ke-hoach-von-phi.component';

const routes: Routes = [
  {
    path: '',
    component: QuanLyKeHoachVonPhiComponent,
    children: [
      {
        path: '',
        redirectTo: 'nguoi-dung',
        pathMatch: 'full',
      },
      {
        path: 'chi-tieu-ke-hoach-nam-cap-tong-cuc',
        loadChildren: () =>
          import(
            './quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem/tim-kiem.module'
          ).then((m) => m.TimKiemModule),
      },
      {
        path: 'quan-ly-lap-tham-dinh-du-toan-nsnn',
        loadChildren: () =>
          import('./quan-ly-lap-tham-dinh-du-toan-nsnn/quan-ly-lap-tham-dinh-du-toan-nsnn.module').then(
            (m) => m.QuanLyLapThamDinhDuToanNSNNModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuanLyKeHoachVonPhiRoutingModule { }
