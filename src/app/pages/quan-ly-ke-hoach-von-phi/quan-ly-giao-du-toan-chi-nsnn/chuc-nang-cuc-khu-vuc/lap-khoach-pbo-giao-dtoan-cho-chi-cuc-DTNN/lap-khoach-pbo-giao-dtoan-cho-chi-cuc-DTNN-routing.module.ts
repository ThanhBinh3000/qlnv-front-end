import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapKhoachPboGiaoDtoanChoChiCucDTNNComponent } from './lap-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component';
const routes: Routes = [
  {
    path: '',
    component: LapKhoachPboGiaoDtoanChoChiCucDTNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule {}
