import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DanhSachKeHoachPhanBoGiaoDuToanCuaDonViRoutingModule } from './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi-routing.module';
import { DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent } from './danh-sach-ke-hoach-phan-bo-giao-du-toan-cua-don-vi.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    DanhSachKeHoachPhanBoGiaoDuToanCuaDonViComponent,
  ],
  imports: [
    CommonModule,
    DanhSachKeHoachPhanBoGiaoDuToanCuaDonViRoutingModule,
    ComponentsModule,
  ],
})

export class DanhSachKeHoachPhanBoGiaoDuToanCuaDonViModule {}
