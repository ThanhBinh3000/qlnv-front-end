import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachThanhToanChoKhachHangRoutingModule } from './danh-sach-thanh-toan-cho-khach-hang-routing.module';
import { DanhSachThanhToanChoKhachHangComponent } from './danh-sach-thanh-toan-cho-khach-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [DanhSachThanhToanChoKhachHangComponent],
  imports: [CommonModule, DanhSachThanhToanChoKhachHangRoutingModule, ComponentsModule],
})
export class DanhSachThanhToanChoKhachHangModule {}
