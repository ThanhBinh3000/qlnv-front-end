import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimKiemNhanDuToanChiNSNNCuaCacDonViComponent } from './tim-kiem-nhan-du-toan-chi-NSNN-cua-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: TimKiemNhanDuToanChiNSNNCuaCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemNhanDuToanChiNSNNCuaCacDonViRoutingModule {}
