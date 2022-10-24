import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';
import { TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViRoutingModule } from './tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi-routing.module';
import { TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent } from './tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component';

@NgModule({
  declarations: [TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent],
  imports: [CommonModule, TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViRoutingModule, ComponentsModule],
})
export class TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViModule {}
