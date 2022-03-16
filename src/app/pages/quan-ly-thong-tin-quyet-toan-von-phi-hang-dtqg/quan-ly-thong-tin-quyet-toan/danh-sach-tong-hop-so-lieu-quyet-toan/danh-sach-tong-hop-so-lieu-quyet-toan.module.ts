import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DanhSachTongHopSoLieuQuyetToanComponent } from './danh-sach-tong-hop-so-lieu-quyet-toan.component';
import { DanhSachTongHopSoLieuQuyetToanRoutingModule } from './danh-sach-tong-hop-so-lieu-quyet-toan-routing.module';

@NgModule({
  declarations: [DanhSachTongHopSoLieuQuyetToanComponent],
  imports: [CommonModule, DanhSachTongHopSoLieuQuyetToanRoutingModule, ComponentsModule],
})
export class DanhSachTongHopSoLieuQuyetToanModule {}
