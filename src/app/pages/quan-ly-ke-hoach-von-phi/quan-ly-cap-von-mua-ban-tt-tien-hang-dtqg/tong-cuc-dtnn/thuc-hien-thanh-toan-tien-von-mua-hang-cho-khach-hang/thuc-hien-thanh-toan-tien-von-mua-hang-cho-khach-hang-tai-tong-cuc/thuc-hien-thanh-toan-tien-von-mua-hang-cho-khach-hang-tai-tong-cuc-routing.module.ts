import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent } from './thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule {}
