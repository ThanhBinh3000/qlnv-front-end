import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhanDuToanChiNSNNChoCacDonViComponent } from './nhan-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: NhanDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhanDuToanChiNSNNChoCacDonViRoutingModule {}
