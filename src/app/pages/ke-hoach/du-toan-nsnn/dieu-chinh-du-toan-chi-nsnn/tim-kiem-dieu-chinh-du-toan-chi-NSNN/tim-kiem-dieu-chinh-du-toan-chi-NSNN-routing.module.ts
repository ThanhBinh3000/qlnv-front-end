import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemDieuChinhDuToanChiNSNNComponent } from './tim-kiem-dieu-chinh-du-toan-chi-NSNN.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemDieuChinhDuToanChiNSNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemDieuChinhDuToanChiNSNNRoutingModule {}
