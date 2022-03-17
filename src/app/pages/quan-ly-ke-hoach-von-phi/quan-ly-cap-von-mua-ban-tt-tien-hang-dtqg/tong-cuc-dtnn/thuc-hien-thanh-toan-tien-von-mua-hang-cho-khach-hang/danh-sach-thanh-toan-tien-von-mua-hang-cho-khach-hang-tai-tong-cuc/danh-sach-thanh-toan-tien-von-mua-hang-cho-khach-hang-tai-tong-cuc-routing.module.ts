import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent } from './danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component';

const routes: Routes = [
  {
    path: '',
    component: DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule {}
