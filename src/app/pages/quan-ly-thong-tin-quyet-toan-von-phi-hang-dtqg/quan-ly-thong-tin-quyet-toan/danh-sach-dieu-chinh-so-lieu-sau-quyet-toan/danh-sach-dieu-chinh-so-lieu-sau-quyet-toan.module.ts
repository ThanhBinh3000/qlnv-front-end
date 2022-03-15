import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachDieuChinhSoLieuSauQuyetToanComponent } from './danh-sach-dieu-chinh-so-lieu-sau-quyet-toan.component';
import { DanhSachDieuChinhSoLieuSauQuyetToanRoutingModule } from './danh-sach-dieu-chinh-so-lieu-sau-quyet-toan-routing.module';

@NgModule({
  declarations: [DanhSachDieuChinhSoLieuSauQuyetToanComponent],
  imports: [CommonModule, DanhSachDieuChinhSoLieuSauQuyetToanRoutingModule, ComponentsModule],
})
export class DanhSachDieuChinhSoLieuSauQuyetToanModule {}
