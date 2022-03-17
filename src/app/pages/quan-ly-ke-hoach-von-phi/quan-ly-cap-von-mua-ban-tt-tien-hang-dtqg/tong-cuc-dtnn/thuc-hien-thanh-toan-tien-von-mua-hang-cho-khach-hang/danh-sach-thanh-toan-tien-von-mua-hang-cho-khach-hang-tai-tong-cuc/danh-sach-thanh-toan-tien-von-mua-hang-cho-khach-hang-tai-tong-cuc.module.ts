import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule } from './danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc-routing.module';
import { DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent } from './danh-sach-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent,
  ],
  imports: [
    CommonModule,
    DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachThanhToanTienVonMuaHangChoKhachHangTaiTongCucModule {}
