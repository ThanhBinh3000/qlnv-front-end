import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhComponent } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-do-tcdt-ban-hanh.component';
const routes: Routes = [
  {
    path: '',
    component: NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapQuyetDinhGiaoDuToanChiNsnnDoTcdtBanHanhRoutingModule {}
