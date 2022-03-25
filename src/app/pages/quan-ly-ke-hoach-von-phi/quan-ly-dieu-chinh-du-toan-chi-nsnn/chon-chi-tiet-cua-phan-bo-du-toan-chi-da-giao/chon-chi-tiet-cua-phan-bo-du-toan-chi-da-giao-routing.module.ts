import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChonChiTietCuaPhanBoDuToanChiDaGiaoComponent } from './chon-chi-tiet-cua-phan-bo-du-toan-chi-da-giao.component';

const routes: Routes = [
  {
    path: '',
    component: ChonChiTietCuaPhanBoDuToanChiDaGiaoComponent
    ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChonChiTietCuaPhanBoDuToanChiDaGiaoRoutingModule {}
