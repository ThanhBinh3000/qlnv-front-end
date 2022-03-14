import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent } from './dsach-tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component';
const routes: Routes = [
  {
    path: '',
    component: DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsachTongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule {}
