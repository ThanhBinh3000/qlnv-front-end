import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViComponent } from './nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViRoutingModule {}
