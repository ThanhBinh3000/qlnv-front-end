import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopLapKeHoachPhanBoDuToanCuaDonViComponent } from './tong-hop-lap-ke-hoach-phan-bo-du-toan-cua-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopLapKeHoachPhanBoDuToanCuaDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopLapKeHoachPhanBoDuToanCuaDonViRoutingModule {}
