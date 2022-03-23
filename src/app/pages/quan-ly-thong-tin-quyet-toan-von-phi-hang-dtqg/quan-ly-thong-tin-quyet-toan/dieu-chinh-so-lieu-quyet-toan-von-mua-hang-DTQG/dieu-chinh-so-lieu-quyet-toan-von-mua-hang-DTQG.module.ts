import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from 'src/app/components/components.module';
import { DieuChinhSoLieuQuyetToanVonMuaHangDTQGComponent } from './dieu-chinh-so-lieu-quyet-toan-von-mua-hang-DTQG.component';
import { DieuChinhSoLieuQuyetToanVonMuaHangDTQGRoutingModule } from './dieu-chinh-so-lieu-quyet-toan-von-mua-hang-DTQG-routing.module';

@NgModule({
  declarations: [DieuChinhSoLieuQuyetToanVonMuaHangDTQGComponent],
  imports: [CommonModule, DieuChinhSoLieuQuyetToanVonMuaHangDTQGRoutingModule, ComponentsModule],
})
export class DieuChinhSoLieuQuyetToanVonMuaHangDTQGModule {}
