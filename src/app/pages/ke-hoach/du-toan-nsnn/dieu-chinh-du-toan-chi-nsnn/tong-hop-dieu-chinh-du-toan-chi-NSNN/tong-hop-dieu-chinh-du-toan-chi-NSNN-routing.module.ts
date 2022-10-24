import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopDieuChinhDuToanChiNSNNComponent } from './tong-hop-dieu-chinh-du-toan-chi-NSNN.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopDieuChinhDuToanChiNSNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopDieuChinhDuToanChiNSNNRoutingModule {}
