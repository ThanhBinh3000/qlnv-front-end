import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViRoutingModule } from './nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViComponent } from './nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

@NgModule({
  declarations: [NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class NhapThongTinQuyetToanGiaoDuToanChiNSNNChoCacDonViModule {}
