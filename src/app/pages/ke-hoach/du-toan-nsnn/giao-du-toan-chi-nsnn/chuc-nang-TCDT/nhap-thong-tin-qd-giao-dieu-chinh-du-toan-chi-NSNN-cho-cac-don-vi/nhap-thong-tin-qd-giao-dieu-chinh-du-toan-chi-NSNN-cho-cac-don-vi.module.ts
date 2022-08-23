import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule } from './nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent } from './nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi.component';

@NgModule({
  declarations: [NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class NhapThongTinQdGiaoDieuChinhDuToanChiNSNNChoCacDonViModule {}
