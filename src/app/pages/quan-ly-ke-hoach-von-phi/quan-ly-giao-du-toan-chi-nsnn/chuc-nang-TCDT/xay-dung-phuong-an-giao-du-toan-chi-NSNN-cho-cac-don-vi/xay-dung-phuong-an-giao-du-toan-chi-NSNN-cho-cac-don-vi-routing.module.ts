import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViComponent } from './xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XayDungPhuongAnGiaoDuToanChiNSNNChoCacDonViRoutingModule {}
