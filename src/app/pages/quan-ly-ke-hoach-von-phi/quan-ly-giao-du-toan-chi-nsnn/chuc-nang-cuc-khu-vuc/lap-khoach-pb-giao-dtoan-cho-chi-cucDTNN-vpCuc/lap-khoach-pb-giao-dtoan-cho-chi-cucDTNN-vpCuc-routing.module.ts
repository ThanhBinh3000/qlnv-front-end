import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucComponent } from './lap-khoach-pb-giao-dtoan-cho-chi-cucDTNN-vpCuc.component';
const routes: Routes = [
  {
    path: '',
    component: LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapKhoachPbGiaoDtoanChoChiCucDTNNVpCucRoutingModule {}
