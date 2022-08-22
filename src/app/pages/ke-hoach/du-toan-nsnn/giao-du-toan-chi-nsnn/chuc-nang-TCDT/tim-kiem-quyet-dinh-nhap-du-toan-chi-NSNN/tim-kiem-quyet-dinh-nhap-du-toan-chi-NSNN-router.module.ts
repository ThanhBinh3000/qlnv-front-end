import { TimKiemQuyetDinhNhapDuToanChiNSNNComponent } from './tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: TimKiemQuyetDinhNhapDuToanChiNSNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimKiemQuyetDinhNhapDuToanChiNSNNRoutingModule {}
