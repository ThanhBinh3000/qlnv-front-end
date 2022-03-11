
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapQuyetDinhGiaoDuToanChiNsnnBtcPdComponent } from './nhap-quyet-dinh-giao-du-toan-chi-nsnn-btc-pd.component';
const routes: Routes = [
  {
    path: '',
    component: NhapQuyetDinhGiaoDuToanChiNsnnBtcPdComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapQuyetDinhGiaoDuToanChiNsnnBtcPdRoutingModule {}
