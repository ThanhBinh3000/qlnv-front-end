import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent } from './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachKeHoachPhanBoGiaoDuToanCuaDonViRoutingModule {}
