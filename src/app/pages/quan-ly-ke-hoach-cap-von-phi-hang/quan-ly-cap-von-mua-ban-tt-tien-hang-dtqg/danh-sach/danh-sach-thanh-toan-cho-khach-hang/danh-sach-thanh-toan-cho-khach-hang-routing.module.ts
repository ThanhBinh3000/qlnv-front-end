import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachThanhToanChoKhachHangComponent } from './danh-sach-thanh-toan-cho-khach-hang.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachThanhToanChoKhachHangComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachThanhToanChoKhachHangRoutingModule {}
