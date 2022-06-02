import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemGiaoDuToanChiNSNNCuaCacDonViComponent } from './tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemGiaoDuToanChiNSNNCuaCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemGiaoDuToanChiNSNNCuaCacDonViRoutingModule {}
