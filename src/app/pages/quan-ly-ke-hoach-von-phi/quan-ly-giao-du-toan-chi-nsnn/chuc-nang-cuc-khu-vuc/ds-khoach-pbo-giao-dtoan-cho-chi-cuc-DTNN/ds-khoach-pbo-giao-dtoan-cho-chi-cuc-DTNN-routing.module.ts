import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsKhoachPboGiaoDtoanChoChiCucDTNNComponent } from './ds-khoach-pbo-giao-dtoan-cho-chi-cuc-DTNN.component';
const routes: Routes = [
  {
    path: '',
    component: DsKhoachPboGiaoDtoanChoChiCucDTNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsKhoachPboGiaoDtoanChoChiCucDTNNRoutingModule {}
