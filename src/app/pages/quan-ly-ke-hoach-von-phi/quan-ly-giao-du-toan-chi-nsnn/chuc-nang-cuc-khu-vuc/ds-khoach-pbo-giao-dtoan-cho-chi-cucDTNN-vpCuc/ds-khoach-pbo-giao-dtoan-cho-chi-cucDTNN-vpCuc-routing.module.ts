import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucComponent } from './ds-khoach-pbo-giao-dtoan-cho-chi-cucDTNN-vpCuc.component';
const routes: Routes = [
  {
    path: '',
    component: DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DsKhoachPboGiaoDtoanChoChiCucDTNNVpCucRoutingModule {}
