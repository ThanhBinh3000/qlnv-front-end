import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TongHopDuToanChiThuongXuyenHangNamComponent } from './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component';

const routes: Routes = [
  {
    path: '',
    component: TongHopDuToanChiThuongXuyenHangNamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TongHopDuToanChiThuongXuyenHangNamRoutingModule {}
