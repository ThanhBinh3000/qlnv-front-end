import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent } from './tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViRoutingModule {}
