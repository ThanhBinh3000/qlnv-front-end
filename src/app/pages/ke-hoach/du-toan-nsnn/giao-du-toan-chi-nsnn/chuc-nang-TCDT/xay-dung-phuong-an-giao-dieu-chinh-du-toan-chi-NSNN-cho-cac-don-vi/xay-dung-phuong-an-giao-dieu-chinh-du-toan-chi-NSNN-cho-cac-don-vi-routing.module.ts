import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent } from './xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungPhuongAnGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule {}
