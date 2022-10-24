import { NhapQuyetDinhGiaoDuToanChiNSNNComponent } from './nhap-quyet-dinh-giao-du-toan-chi-NSNN.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: NhapQuyetDinhGiaoDuToanChiNSNNComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapQuyetDinhGiaoDuToanChiNSNNRoutingModule {}
