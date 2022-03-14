import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent } from './tong-hop-lap-khoach-pbo-giao-dtoan-cua-dvi-trinh-tc.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopLapKhoachPboGiaoDtoanCuaDviTrinhTcRoutingModule {}
