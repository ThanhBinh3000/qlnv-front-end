import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent } from './nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule {}
