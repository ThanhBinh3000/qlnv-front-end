import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThanhToanChoKhachHangRoutingModule } from './thanh-toan-cho-khach-hang-routing.module';
import { ThanhToanChoKhachHangComponent } from './thanh-toan-cho-khach-hang.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  declarations: [ThanhToanChoKhachHangComponent],
  imports: [CommonModule, ThanhToanChoKhachHangRoutingModule, ComponentsModule],
})
export class ThanhToanChoKhachHangModule {}
