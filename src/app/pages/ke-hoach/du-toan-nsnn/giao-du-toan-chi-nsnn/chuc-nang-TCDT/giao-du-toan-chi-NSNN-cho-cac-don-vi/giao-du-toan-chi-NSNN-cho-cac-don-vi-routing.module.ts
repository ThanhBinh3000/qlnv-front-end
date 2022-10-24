import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiaoDuToanChiNSNNChoCacDonViComponent } from './giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: GiaoDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GiaoDuToanChiNSNNChoCacDonViRoutingModule {}
