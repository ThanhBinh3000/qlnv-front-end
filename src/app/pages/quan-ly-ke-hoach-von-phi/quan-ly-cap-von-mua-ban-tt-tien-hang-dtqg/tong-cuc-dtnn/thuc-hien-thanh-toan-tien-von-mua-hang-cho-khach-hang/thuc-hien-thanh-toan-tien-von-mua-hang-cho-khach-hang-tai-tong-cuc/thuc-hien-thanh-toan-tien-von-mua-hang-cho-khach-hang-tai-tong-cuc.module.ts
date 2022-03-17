import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule } from './thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc-routing.module';
import { ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent } from './thuc-hien-thanh-toan-tien-von-mua-hang-cho-khach-hang-tai-tong-cuc.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucComponent
  ],
  imports: [
    CommonModule,
    ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucRoutingModule,
    ComponentsModule,
  ],
})

export class ThucHienThanhToanTienVonMuaHangChoKhachHangTaiTongCucModule {}
